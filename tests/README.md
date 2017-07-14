works on meteor localhost:3000
requires proxy setup done by admin.


navigate to platform/tests/Gate_1 in cmd
command to run gate 1 tests:
python -m robot 1.registering.robot 2.Login.robot 3.addapi.robot 4.apicat.robot 5.proxy.robot 6.profile.robot
Runtime: 1 min 30sec
each failing test adds either 0 or 5 seconds.

navigate to platform/tests/Gate_2 in cmd
commad to run gate 2 tests:
python -m robot 1.registering.robot 2.Login.robot 3.addapi.robot 4.addorg.robot 5.profile_admin.robot 6.apicat.robot 7.orgcat.robot 8.proxy.robot 9.profile.robot

gate 2 still needs seeded admin account and proxy setup