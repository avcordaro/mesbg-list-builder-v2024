from data_reader import DataFile
from json_file_writer import JsonFileWriter

from mappers.model_data_converter import ModelDataConverter
from mappers.hero_constraint_data_converter import HeroConstraintDataConverter
from mappers.warning_data_converter import WarningDataConverter


df = DataFile("mesbg_data.xlsx")

model_data_converter = ModelDataConverter(df.models, df.options)
model_data = model_data_converter.convert_raw_data_and_convert_to_json_dict()
JsonFileWriter.create_json_dump(model_data, file_name="mesbg_data.json")

hero_constraint_converter = HeroConstraintDataConverter(df.constraints)
constraint_data = hero_constraint_converter.convert_to_json_dict()
JsonFileWriter.create_json_dump(constraint_data, "hero_constraint_data.json")

warning_data_converter = WarningDataConverter(df.warnings)
warning_data = warning_data_converter.convert_to_json_dict()
JsonFileWriter.create_json_dump_from_data_frame(warning_data, file_name="warning_rules.json", orient="index")

JsonFileWriter.create_json_dump_from_data_frame(df.keywords, file_name="keywords.json")