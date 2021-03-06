"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dictionary {
    constructor() {
        this.keys = [];
        this.codes = {};
    }
    add(item) {
        this.keys[item.key] = item;
        this.codes[item.code] = item;
    }
    find(index) {
        if (typeof index == "number") {
            return this.keys[index];
        }
        else {
            return this.codes[index];
        }
    }
    findDescription(description) {
        for (var i = 0; i < this.keys.length; i++)
            if (this.keys[i].description == description)
                return this.keys[i];
    }
    list(sort = true) {
        var list = [];
        for (var key in this.codes) {
            if (this.codes.hasOwnProperty(key)) {
                list.push(this.codes[key].description);
            }
        }
        if (sort)
            return list.sort();
        else
            return list;
    }
    codeList(sort = true) {
        var list = [];
        for (var key in this.codes) {
            if (this.codes.hasOwnProperty(key)) {
                list.push(key);
            }
        }
        if (sort)
            return list.sort();
        else
            return list;
    }
}
exports.Dictionary = Dictionary;
class Item {
    constructor(key, code, description) {
        this.key = key;
        this.code = code;
        if (description == null) {
            this.description = code;
        }
        else {
            this.description = description;
        }
    }
}
exports.Item = Item;
var MonitorTypes;
(function (MonitorTypes) {
    MonitorTypes[MonitorTypes["website"] = 0] = "website";
    MonitorTypes[MonitorTypes["DBL"] = 1] = "DBL";
    MonitorTypes[MonitorTypes["email"] = 2] = "email";
    MonitorTypes[MonitorTypes["GSB"] = 3] = "GSB";
    MonitorTypes[MonitorTypes["performance"] = 4] = "performance";
    MonitorTypes[MonitorTypes["scoring"] = 5] = "scoring";
    MonitorTypes[MonitorTypes["DNS"] = 6] = "DNS";
    MonitorTypes[MonitorTypes["certificate"] = 7] = "certificate";
    MonitorTypes[MonitorTypes["ping"] = 8] = "ping";
    MonitorTypes[MonitorTypes["port"] = 9] = "port";
    MonitorTypes[MonitorTypes["portScan"] = 10] = "portScan";
})(MonitorTypes = exports.MonitorTypes || (exports.MonitorTypes = {}));
exports.monitorTypes = new Dictionary();
exports.monitorTypes.add(new Item(MonitorTypes.website, 'website', 'Website'));
exports.monitorTypes.add(new Item(MonitorTypes.DBL, 'DBL', 'Domain Blocklist'));
exports.monitorTypes.add(new Item(MonitorTypes.email, 'email', 'Email Blocklists'));
exports.monitorTypes.add(new Item(MonitorTypes.GSB, 'GSB', 'Google Safe Browsing'));
exports.monitorTypes.add(new Item(MonitorTypes.performance, 'performance', 'Real User Performance'));
exports.monitorTypes.add(new Item(MonitorTypes.scoring, 'scoring', 'Malicious Bot/User Detection'));
exports.monitorTypes.add(new Item(MonitorTypes.DNS, 'DNS', 'DNS Expected Values'));
exports.monitorTypes.add(new Item(MonitorTypes.certificate, 'certificate', 'Certificate Validity'));
exports.monitorTypes.add(new Item(MonitorTypes.ping, 'ping', 'Ping'));
exports.monitorTypes.add(new Item(MonitorTypes.port, 'port', 'TCP Port'));
exports.monitorTypes.add(new Item(MonitorTypes.portScan, 'portScan', 'Port Scan'));
//# sourceMappingURL=dictionaries.js.map