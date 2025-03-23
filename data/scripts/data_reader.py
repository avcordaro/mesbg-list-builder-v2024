import os
import pandas

class DataFile:

    # Load the data file from the given file_path and converts the Excel
    # sheets into properties.
    def __init__(self, file_path):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, '../' + file_path)
        self.__load_data_from_file(filename)


    def __load_data_from_file(self, file_path):
        self.models = pandas.read_excel(file_path, sheet_name="models")
        self.options = pandas.read_excel(file_path, sheet_name="options")
        self.armies = pandas.read_excel(file_path, sheet_name="army_lists")
        self.constraints = pandas.read_excel(file_path, sheet_name="hero_constraints")
        self.warnings = pandas.read_excel(file_path, sheet_name="warning_rules")
        self.keywords = pandas.read_excel(file_path, sheet_name="keywords")

