import subprocess
from subprocess import PIPE
from os import path
import sys
from trackmate_file_handler import beautify_csv


WORKING_DIR = "C:/NodeServer/cell_death/data/"

def runTrackmate(first_file_path, output_file_path):
	# script_status = subprocess.call('ImageJ-win64 New_.py', capture_output=True)
	# result = subprocess.run('ImageJ-win64 New_.py', shell=True, check=True, stdout=subprocess.PIPE);
	# output = subprocess.run(["cat", "data.txt"], capture_output=True)

	# print((result.stdout).decode('ascii'))
	command = 'ImageJ-win64 New_.py "{}" "{}"'.format(first_file_path, output_file_path)
	p = subprocess.run(command,shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	output = p.stdout.decode('ascii')
	if "TrackMate finished successfully" in output:
		beautify_csv(output_file_path)
	else:
		raise Exception("Failed to execute trackmate script")

def get_file_path(experiment_id):
	experiemnt_first_image = None
	save_file = None
	if not path.isdir(WORKING_DIR+experiment_id):
		raise Exception("No experiemnt folder")
	else:
		save_file = WORKING_DIR+experiment_id+"/"+experiment_id+".csv"
	if not path.isdir(WORKING_DIR+experiment_id+"/images"):
		raise Exception("No images folder in experiment")
	if not path.isfile(WORKING_DIR+experiment_id+"/images"+"/"+experiment_id+"_0.tif"):
		raise Exception("No first tif file found")
	else:
		experiemnt_first_image = WORKING_DIR+experiment_id+"/images"+"/"+experiment_id+"_1.tif"
	return (experiemnt_first_image, save_file)

if __name__=='__main__':
	if len(sys.argv) != 2:
		raise Exception("Missing argument")
	else:
		experiment_id = sys.argv[1]
		try:
			first_file_path, save_file_path = get_file_path(experiment_id)
			runTrackmate(first_file_path, save_file_path)
		except Exception as e:
			raise e 