import json

from constants import data_files_destination_path

class JsonFileWriter:

    @staticmethod
    def create_json_dump(data, file_name):
        file_path = data_files_destination_path + "/" + file_name
        with open(file_path, "w") as file:
            file.write(json.dumps(data, indent=2))

    @staticmethod
    def create_json_dump_from_data_frame(data, file_name, orient='records'):
        file_path = data_files_destination_path + "/" + file_name
        with open(file_path, "w") as file:
            file.write(data.to_json(orient=orient, indent=2))