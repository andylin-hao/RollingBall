function get360WebshieldConfig() {
    return {
        "ciuvo": {
            "enabled": true,
            "inject_on_safe": true
        },
        "storeconsultant": {
            "enabled": true,
            "inject_on_safe": true
        },
        "stat": {
            "dau": {
                "res": "UA-102283103-1",
                "rate": "10"
            },
            "agreement": {
                "res": "UA-102283103-1",
                "rate": "100"
            },
            "shopping_on_off": {
                "res": "UA-102283103-1",
                "rate": "100"
            },
            "shopping_normal": {
                "res": "UA-102283103-2",
                "rate": "15"
            },
            "popup": {
                "res": "UA-102283103-4",
                "rate": "100"
            }
        },
        "stat_ff": {
            "dau": {
                "res": "UA-102283103-5"
            },
            "agreement": {
                "res": "UA-102283103-5"
            },
            "shopping_on_off": {
                "res": "UA-102283103-5"
            },
            "shopping_normal": {
                "res": "UA-102283103-5"
            },
            "popup": {
                "res": "UA-102283103-5"
            }
        }
    };
}

