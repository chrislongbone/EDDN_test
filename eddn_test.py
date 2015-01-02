import zlib
import zmq.green as zmq
import simplejson
import MySQLdb as mdb
from django.utils.encoding import smart_str, smart_unicode
import sys

def main():
	con = mdb.connect('localhost', 'elite_eddn', 'Ktud8u;v5%ELd6s', 'elite_eddn');
	context = zmq.Context()
	subscriber = context.socket(zmq.SUB)
	subscriber.setsockopt(zmq.SUBSCRIBE, "")
	subscriber.connect('tcp://eddn-relay.elite-markets.net:9500')

	while True:
		market_json = zlib.decompress(subscriber.recv())
		market_data = simplejson.loads(market_json)
		if market_data['$schemaRef'] == 'http://schemas.elite-markets.net/eddn/commodity/1':
			softwareVersion = market_data['header']['softwareVersion']
			gatewayTimestamp = market_data['header']['gatewayTimestamp']
			softwareName = market_data['header']['softwareName']
			uploaderID = market_data['header']['uploaderID']
			buyPrice = market_data['message']['buyPrice']
			timestamp = market_data['message']['timestamp']
			stationStock = market_data['message']['stationStock']
			systemName = market_data['message']['systemName'].encode('utf-8')
			stationName = market_data['message']['stationName'].encode('utf-8')
			demand = market_data['message']['demand']
			sellPrice = market_data['message']['sellPrice']
			itemName = market_data['message']['itemName'].encode('utf-8')

			#Escape Quotes for MySQL insertion
			systemName = systemName.replace("'","\\'")
			stationName = stationName.replace("'","\\'")
			itemName = itemName.replace("'","\\'")

			with con:

				cur = con.cursor()
				insert_stmt = "INSERT INTO commodities (softwareVersion, gatewayTimestamp, softwareName, uploaderID, buyPrice, timestamp, \
					stationStock, systemName, stationName, demand, sellPrice, itemName, server_time) VALUES \
					('%s','%s','%s','%s',%s,'%s',%s,'%s','%s',%s,%s,'%s',NOW())"
				data = (softwareVersion,gatewayTimestamp,softwareName,uploaderID,buyPrice,timestamp,stationStock,systemName,stationName, \
					demand,sellPrice,itemName)

				do_insert = smart_str(insert_stmt % data)

				print do_insert

				cur.execute(do_insert)

				print smart_str("Row Inserted for %s %s %s %s" % (systemName,stationName,itemName,cur.rowcount))

			sys.stdout.flush()

if __name__ == '__main__':
	main()
