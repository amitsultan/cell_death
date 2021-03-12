import sys
 
from ij import IJ
from ij import WindowManager
from ij.process import ImageConverter

from fiji.plugin.trackmate import Model
from fiji.plugin.trackmate import Settings
from fiji.plugin.trackmate import TrackMate
from fiji.plugin.trackmate import SelectionModel
from fiji.plugin.trackmate import Logger
from fiji.plugin.trackmate.detection import LogDetectorFactory
from fiji.plugin.trackmate.tracking import LAPUtils
from fiji.plugin.trackmate.tracking.oldlap import SimpleLAPTrackerFactory
from fiji.plugin.trackmate.tracking.sparselap import SparseLAPTrackerFactory
from fiji.plugin.trackmate.providers import SpotAnalyzerProvider
from fiji.plugin.trackmate.providers import EdgeAnalyzerProvider
from fiji.plugin.trackmate.providers import TrackAnalyzerProvider
import fiji.plugin.trackmate.visualization.hyperstack.HyperStackDisplayer as HyperStackDisplayer
import fiji.plugin.trackmate.features.FeatureFilter as FeatureFilter
import csv
import os 

def run_process(input_path, output_path): 

	IJ.run("Image Sequence...", "open=["+input_path+"] convert sort");
	imp = WindowManager.getCurrentImage()
	dims = imp.getDimensions();
	imp.setDimensions( dims[ 2 ], dims[ 4 ], dims[ 3 ] );
	dims = imp.getDimensions();
	ImageConverter(imp).convertToGray8() 


	model = Model()
	model.setLogger(Logger.IJ_LOGGER)

	settings = Settings()
	settings.setFrom(imp)

	settings.detectorFactory = LogDetectorFactory()
	settings.detectorSettings = { 
    	'DO_SUBPIXEL_LOCALIZATION' : True,
    	'RADIUS' : float(11.0),
    	'THRESHOLD' : float(0.0),
    	'DO_MEDIAN_FILTERING' : True
	}  

	# Configure spot filters - Classical filter on quality
	# filter1 = FeatureFilter('QUALITY', 30, True)
	# settings.addSpotFilter(filter1)

	settings.trackerFactory = SparseLAPTrackerFactory()
	settings.trackerSettings = LAPUtils.getDefaultLAPSettingsMap() #this sets tens of madatory settings
	settings.trackerSettings['LINKING_MAX_DISTANCE'] = 15.0
	settings.trackerSettings['GAP_CLOSING_MAX_DISTANCE']=15.0
	settings.trackerSettings['MAX_FRAME_GAP']= 2
#	print(LAPUtils.getDefaultLAPSettingsMap())


#
#	settings.trackerFactory = SimpleLAPTrackerFactory()
##	settings.trackerSettings = LAPUtils.SimpleLAPTrackerFactory() #this sets tens of madatory settings
#	settings.trackerSettings['LINKING_MAX_DISTANCE'] = 15.0
#	settings.trackerSettings['GAP_CLOSING_MAX_DISTANCE']=15.0
#	settings.trackerSettings['MAX_FRAME_GAP']= 2
#	settings.trackerSettings['ALLOW_GAP_CLOSING']= True
#	settings.trackerSettings['ALLOW_TRACK_SPLITTING']= False
#	settings.trackerSettings['ALLOW_TRACK_MERGING']= False
#	settings.trackerSettings['SPLITTING_MAX_DISTANCE']= 1000.0
#	settings.trackerSettings['MERGING_MAX_DISTANCE']= 1000.0
#	settings.trackerSettings['ALTERNATIVE_LINKING_COST_FACTOR']= 1000.0
#	# ?
#	settings.trackerSettings['CUTOFF_PERCENTILE']= 1000.0
#	settings.trackerSettings['BLOCKING_VALUE']= 1000.0
#
#	filter2 = FeatureFilter('NUMBER_OF_SPOTS_IN_TRACK', 6.86, True)
#	settings.addTrackFilter(filter2)
	
	trackmate = TrackMate(model, settings)

	ok = trackmate.checkInput()
	if not ok:
		sys.exit(str(trackmate.getErrorMessage()))
		raise Exception("trackmate: checkInput failed")

	# if ok:
	# 	print("Input ok")


	ok = trackmate.process()
	if not ok:
		raise Exception("trackmate: process failed")


	# if ok:
	# 	print("Process ok")
	#----------------
	# Display results
	#----------------
  
	model.getLogger().log('Found ' + str(model.getTrackModel().nTracks(True)) + ' tracks.')
 
	selectionModel = SelectionModel(model)

	displayer =  HyperStackDisplayer(model, selectionModel, imp)

#	displayer.render()

	# The feature model, that stores edge and track features.
	fm = model.getFeatureModel()
	# print(fm)
	labels_row = ['id','spot_id','x', 'y', 'frame','quality', 'type', 'length']
	#'qualitiy','visability', 'track_length']
	#rows = []
	track_ids = model.getTrackModel().trackIDs(True)
	with open(output_path, 'w') as file:
		writer = csv.writer(file)
		writer.writerow(labels_row)
		for id in track_ids:
    		# Fetch the track feature from the feature model.
#			model.getLogger().log('')
#			model.getLogger().log('Track ' + str(id) + ': mean velocity = ' + str(v) + ' ' + model.getSpaceUnits() + '/' + model.getTimeUnits())
			track = model.getTrackModel().trackSpots(id)
			num_spots = track.size()
#			print(track)
			# q=track.getFeature('QUALITY')
			# row.append(q)
#			snr=track.getFeature('SNR') 
#			row.append(snr)
#			mean=track.getFeature('MEAN_INTENSITY')
#			row.append(mean)
#			visability=spot.getFeature('VISABILITY')
#			row.append(visability)
			# 	row.append(len(track))
 			# use only first spot in track
			for spot in track:
#				print(spot.getFeatures())
				row = []
				row.append(id)
				sid = spot.ID()
				row.append(sid)
    		# Fetch spot features directly from spot. 
				x=spot.getFeature('POSITION_X')
				row.append(x)
				y=spot.getFeature('POSITION_Y')
				row.append(y)
				t=spot.getFeature('FRAME')
				row.append(int(t))
#			print("x: {} y: {} t: {}".format(x, y, t))
				q=spot.getFeature('QUALITY')
				row.append(q)
#				snr=spot.getFeature('SNR') 
#				row.append(snr)
#				mean=spot.getFeature('MEAN_INTENSITY')
#				row.append(mean)
				# visibility=spot.getFeature('VISIBILITY')
#				print(visibility)
#				break
#				row.append(visability)
#				model.getLogger().log('\tspot ID = ' + str(sid) + ': x='+str(x)+', y='+str(y)+', t='+str(t)+', q='+str(q) + ', snr='+str(snr) + ', mean = ' + str(mean))
				row.append(1)
				row.append(num_spots)
				writer.writerow(row)
#			rows.append(row)
		file.close()
		return IJ
		
if __name__=='__main__':
	if len(sys.argv) != 3:
		raise Exception("Missing arguments")
	else:
		first_file_path = sys.argv[1]
		output_file_path = sys.argv[2]
		try:
			ij_process = run_process(first_file_path, output_file_path)
			if ij_process != None:
				print("TrackMate finished successfully")
				ij_process.close()
			else:
				raise Exception("Unexcpeted error")
		except Exception as e:
			raise e
#	run_process("C:/NodeServer/cell_death/data/test/test-sytox-green_0.tif","C:/NodeServer/cell_death/data/test/test-sytox-green.csv")
