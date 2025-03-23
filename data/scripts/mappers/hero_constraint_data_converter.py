
class HeroConstraintDataConverter:

    def __init__(self, hero_constraints):
        self.__hero_constraints = hero_constraints

    def convert_to_json_dict(self):
        self.__hero_constraints['valid_warband_units'] = self.__hero_constraints['valid_warband_units'].apply(eval)
        self.__hero_constraints['extra_profiles'] = self.__hero_constraints['extra_profiles'].apply(eval)
        self.__hero_constraints = self.__hero_constraints.groupby('model_id').apply(lambda x: x[['valid_warband_units', 'extra_profiles']].to_dict(orient='records')[0])

        return self.__hero_constraints.to_dict()