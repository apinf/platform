#!/bin/sh
CURR_DIR=$(pwd)
export PATH=$PATH:$CURR_DIR/utils

t_type=
t_suite=

exit_with_error() {
    echo "$@"
    exit 1
}

show_help_and_exit() {
    echo "Usage $(basename $0)"
    echo "Available options:\t-h, -type, -suite"
    echo "\t-h\t:\tPrint this text"
    echo "\t-type\t:\tType of the test run, e.g. robot, chimp"
    echo "\t-suite\t:\tSpecify the suite, e.g. Gate_1, Gate_2"
    exit 0
}

while [ $# -gt 0 ]; do
    case $1 in
        -h|-help)
            show_help_and_exit
            ;;
        -type)
            test -z "$2" && exit_with_error "Parameter -type requires an argument"
            test "$2" = "robot" -o "$2" = "chimp" || exit_with_error "Supported types: chimp, robot"
            t_type=$2
            shift && shift
            ;;
        -suite)
            test -z "$2" && exit_with_error "Parameter -suite requires an argument"
            test -d "$2" || exit_with_error "No such test-group/suite with name '$2' exists"
            t_suite=$2
            shift && shift
            ;;
        *)
            shift
            ;;
    esac
done

test -n "$t_type" || exit_with_error "No test type has been selected"
test -n "$t_suite" || exit_with_error "No test suite has been selected"

if [ $t_type = "robot" ]; then
    cd $t_suite
    files=$(ls *.robot)
    python -m robot $files
else
    :
    #support the chimp runner here
fi
