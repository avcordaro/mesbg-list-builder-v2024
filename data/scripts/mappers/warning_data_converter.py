class WarningDataConverter:

    def __init__(self, warnings):
        self.__warnings = warnings

    def convert_to_json_dict(self):
        self.__warnings['dependencies'] = self.__warnings['dependencies'].apply(eval)
        self.__warnings = self.__warnings.groupby(by='subject').apply(lambda x: x[['type', 'dependencies', 'warning']].to_dict(orient='records'))

        return self.__warnings
