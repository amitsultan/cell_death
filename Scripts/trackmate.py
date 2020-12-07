import subprocess


def runTrackmate(path):
	script_status = subprocess.call('ImageJ-win64 main.py')
	print(script_status)

runTrackmate("")