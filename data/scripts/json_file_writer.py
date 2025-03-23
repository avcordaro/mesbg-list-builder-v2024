import os
import json

class JsonFileWriter:

    __data_files_destination_path = '../../src/assets/data'

    @staticmethod
    def create_json_dump(data, file_name):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, JsonFileWriter.__data_files_destination_path + "/" + file_name)
        with open(filename, "w") as file:
            file.write(json.dumps(data, indent=2))

    @staticmethod
    def create_json_dump_from_data_frame(data, file_name, orient='records'):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, JsonFileWriter.__data_files_destination_path + "/" + file_name)
        with open(filename, "w") as file:
            file.write(data.to_json(orient=orient, indent=2))