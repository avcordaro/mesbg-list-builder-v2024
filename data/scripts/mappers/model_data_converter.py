import pandas

from constants import warband_sizes, unit_type_order

class ModelDataConverter:

    def __init__(self, models, options):
        self.__models = models
        self.__options = options

    @staticmethod
    def __get_warband_size(row):
        if row['name'] in ["The Dark Lord Sauron", "The Goblin King"]:
            return 24
        if row['name'] in ["Grinnah, Goblin Jailer", "The Goblin Scribe", "Goblin Captain"]:
            return 18
        return warband_sizes[row['unit_type']]

    @staticmethod
    def __clean_nan_data_fields(data_frame, keep_empty_list: bool = False):
        return [
            {
                k: v
                for k, v in data.items()
                if (v != [] or keep_empty_list) and v is not False and not pandas.isnull(v if type(v) != list else 1)
            }
            for data in data_frame.to_dict(orient="records")
        ]

    def convert_raw_data_and_convert_to_json_dict(self):
        return self.__convert_to_json_dict()

    def __convert_model_data(self):
        # Applies the warband_size to each unit using their listed heroic tier.
        self.__models["warband_size"] = self.__models.apply(self.__get_warband_size, axis=1)
        # Removes any entries that have an unknown unit type.
        self.__models["unit_type"] = pandas.Categorical(self.__models.unit_type, categories=unit_type_order)
        # Make sure the MWFW becomes an actual array.
        self.__models["MWFW"] = self.__models["MWFW"].apply(eval)
        # Converter fiels from 0/1 to a bool (true/false)
        self.__models["opt_mandatory"] = self.__models["opt_mandatory"] == 1
        self.__models["no_followers"] = self.__models["no_followers"] == 1
        self.__models['legacy'] = self.__models['legacy'] == 1

    def __convert_option_column_to_wanted_data_type(self):
        int_columns = ['points', 'quantity', 'passengers']
        for col in int_columns:
            self.__options[col] = pandas.to_numeric(self.__options[col], errors='coerce', downcast='signed').astype(
                'Int64')
        # Converter 'included' field to a bool
        self.__options["included"] = self.__options["included"] == 1

    def __convert_options_data(self):
        # Sorts all the options based on model_id and then points. Having points going from 'High to Low'.
        self.__options.sort_values(by=['model_id', 'points'], ascending=[True, False], inplace=True)
        # Set the quantity of the option to 1 if its automatically included (included = 1)
        self.__options["quantity"] = self.__options.included.apply(lambda x: 1 if x == True else None)
        # Make sure each option has a list of dependencies. If its missing form the datafile set the value
        # to an empty JSON array.
        self.__options["dependencies"] = self.__options.dependencies.fillna("[]").apply(eval)
        self.__convert_option_column_to_wanted_data_type()

    def __merge_models_and_options(self):
        # Apply the list of option on each of the models.
        self.__models_with_options = self.__models.merge(
            self.__options.groupby("model_id").apply(self.__clean_nan_data_fields).rename("options"),
            on="model_id",
            how="left"
        )
        # Add an empty list of options if there were no options listed.
        self.__models_with_options["options"] = self.__models_with_options["options"].apply(
            lambda x: x if isinstance(x, list) else [])
        # Drop the model_id from the options as it is no longer needed after joining the 2 datasets.
        self.__models_with_options['options'] = self.__models_with_options['options'].apply(
            lambda options: [{key: value for key, value in option.items() if key != 'model_id'} for option in options])

    def __convert_to_json_dict(self):
        self.__convert_model_data()
        self.__convert_options_data()
        self.__merge_models_and_options()

        self.__models_with_options.sort_values(
            by=['army_list', 'unit_type', 'base_points', 'name'],
            ascending=[True, True, False, True],
            inplace=True
        )

        jdict = self.__clean_nan_data_fields(self.__models_with_options, True)
        jdict = {d['model_id']: d for d in jdict}

        return jdict
