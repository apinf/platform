works on meteor localhost:3000
creates new account and 1 new api. 
requires proxy setup done by admin,
1 api called "Kappa" that has proxy adress:
https://nightly.apinf.io:3002/googol/

after the test, Kissa api has to be deleted
or it fails 1/28 tests next time on same instance.

navigate to docs/testing/gate_1 in cmd
command to run gate 1 tests:
python -m robot 1.registering.txt 2.Login.txt 3.addapi.txt 4.apicat.txt 5.proxy.txt 6.profile.txt
Runtime: 1 min 15sec
each failing test adds either 0 or 5 seconds.
