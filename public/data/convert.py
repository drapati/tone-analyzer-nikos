import json
import os, sys

def convert(args):
    data = open(args[0], 'r').read()
    print data
    print json.loads(data)

if __name__ == '__main__':
    convert(sys.argv[1:])

