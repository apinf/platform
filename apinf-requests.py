import sys
import json
import urllib
import pycurl

def parseJSON(data):
    return json.loads(data)

def curlDefaultCallback(data):
    print("in callback")
    data = json.loads(data)
    print (json.dumps(data, indent=4, sort_keys=True))
    return

def createCurlRequest(url, callback=curlDefaultCallback):
    #FIXME: Have an option in future to customize pycurl options
    curl = pycurl.Curl()
    curl.setopt(pycurl.URL, url)
    curl.setopt(pycurl.SSL_VERIFYPEER, 0)
    curl.setopt(pycurl.SSL_VERIFYHOST, 0)
    curl.setopt(pycurl.WRITEFUNCTION, callback)
    curl.perform()

    return curl

def createAPINF_Request(search_term, key):
    base_url = "https://umbrella.apinf.io";
    api_prefix = "google/maps/api/geocode/json?sensor=false"
    param_address = "address=%s" % search_term
    url = "%s/%s&%s&api_key=%s" % (base_url, api_prefix, param_address, key)
    print (url)
    createCurlRequest(url)

if __name__ == "__main__":
    if len(sys.argv) == 2:
        key = sys.argv[1] 
        search_strings = ["Koronakatu", "Kaivomestarinkatu", "Itamerenkatu"]
        for word in search_strings:
            createAPINF_Request(word, key)
    else:
        print "Usage: %s your_apinf_key" % sys.argv[0]
        sys.exit(1)
