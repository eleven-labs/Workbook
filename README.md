Workbook
========

Workbook is a relational intranet in Node.js. It allows employees of a company to search and list quickly their colleagues. A newsfeed also enables him to be aware of various events planned by the company or its employees.

Requirements
------------

MongoDb (2.x) and Node.js (version >= 0.8.4)

Installation
------------

```
npm cache clear
npm install -g grunt-cli bower mocha nave coffee-script
nave use 0.10.31
git clone https://github.com/eleven-labs/Workbook.git
cd Workbook/client
npm install
bower install
grunt build
grunt karma:unit
cd ../server
cp config/development.json-dist config/development.json
npm install
node scripts/create-admin-user.js --email=my@email.com --password=workbook --admin=1 --firstName=Admin --lastName=User --status=consultant --validated=1
sudo -E node server.js
```

Browse to the application at [http://localhost](http://localhost) and log in with email "my@email.com" and password "workbook".

----------

[Functional overview](https://github.com/eleven-labs/Workbook/issues/42)
---------------------

[Technical directive](https://github.com/eleven-labs/Workbook/issues/43)
---------------------
