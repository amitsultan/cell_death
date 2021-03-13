import pandas as pd
import statistics

def beautify_csv(path):
	data = pd.read_csv(path, skip_blank_lines=True, delimiter=',')

	# quality_threshold = statistics.median(data['quality'])
	quality_threshold = data.quality.quantile([0.8]).array[0]
	length_threshold = data.length.quantile([0.9]).array[0] 

	# quality filter
	data = data.loc[(data['quality'] > quality_threshold)]
	# num of spots filter
	data = data.loc[(data['length'] > length_threshold)]

	data = data.loc[data.groupby('id')['frame'].idxmin()]

	data = data.drop(['quality', 'length', 'spot_id'], axis=1)
	# data = data.drop('spot_id', axis=1)

	data.sort_values('frame', inplace=True)

	# data.to_csv(path)
	data.to_csv(path)

	print(data)