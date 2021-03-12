import subprocess
from subprocess import PIPE
from os import path
import sys
from trackmate_file_handler import beautify_csv
import timeit

WORKING_DIR = "C:/NodeServer/cell_death/data/"
NEW_PY = "C:\\NodeServer\\cell_death\\Scripts\\New_.py"

def runTrackmate(first_file_path, output_file_path):
	# script_status = subprocess.call('ImageJ-win64 New_.py', capture_output=True)
	# result = subprocess.run('ImageJ-win64 New_.py', shell=True, check=True, stdout=subprocess.PIPE);
	# output = subprocess.run(["cat", "data.txt"], capture_output=True)

	# print((result.stdout).decode('ascii'))
	
	start = timeit.default_timer()
	command = 'ImageJ-win64 "{}" "{}" "{}"'.format(NEW_PY, first_file_path, output_file_path)
	p = subprocess.run(command,shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	print('Time: ', timeit.default_timer() - start, ' s')
	# if p is None:
	# 	raise Exception("oops i have excption p is None")
	output = p.stdout.decode('ascii')
	
	error = p.stderr.decode('ascii')
	# if output is None:
	# 	raise Exception("oops i have excption output is None {}".format(output))

	if "TrackMate finished successfully" in output:
		print(output)
		beautify_csv(output_file_path)
	# if output is not None:
		# beautify_csv(output_file_path)
	else:
		print(error)
		raise Exception("Failed to execute trackmate script")
		# raise Exception("output is none {}".format(output))

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
		experiemnt_first_image = WORKING_DIR+experiment_id+"/images"+"/"+experiment_id+"_0.tif"
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
			print("oops i have excption")
			raise e 