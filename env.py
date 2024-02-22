#!/usr/local/opt/python@3.7/bin/python3.7

import json
import argparse


def main() -> int:
    parser = argparse.ArgumentParser(prog='env.py', description='Set application environment')
    parser.add_argument('scheme')
    parser.add_argument('filename')
    args = parser.parse_args()

    data = {
        "Test": {
            "sipDomain": "80.75.130.97:5070",
            "apiEndpoint": "mobile-gw-grpc.mobile.test.oliwio.rnd.mtt:443",
            "certFile": "test.pem"
        },
        "PreProd": {
            "sipDomain": "80.75.130.72:5070"
        },
        "Prod": {
            "sipDomain": "sip.exolve.ru:5070"
        }
    }

    env = {
        "environments": {
            args.scheme: data[args.scheme]
        },
        "currentEnvironment": args.scheme
    }
    print('Application environment:', env)

    with open(args.filename, 'w') as f:
        json.dump(env, f, indent = 4, ensure_ascii = False)

    return 0

main()