const question = `
A manufacturing system contains m machines, each subject to randomly occurring
breakdowns. A machine runs for an amount of time that is an exponential random variable with mean 8 hours before breaking down. There are s (where s is a fi xed, positive
integer) repairmen to fi x broken machines, and it takes one repairman an exponential
amount of time with mean 2 hours to complete the repair of one machine; no more
than one repairman can be assigned to work on a broken machine even if there are
other idle repairmen. If more than s machines are broken down at a given time, they
form a FIFO “repair” queue and wait for the fi rst available repairman. Further, a repairman works on a broken machine until it is fi xed, regardless of what else is happening in the system. Assume that it costs the system $50 for each hour that each machine
is broken down and $10 an hour to employ each repairman. (The repairmen are paid
an hourly wage regardless of whether they are actually working.) Assume that m 5 5,
but write general code to accommodate a value of m as high as 20 by changing an
input parameter. Simulate the system for exactly 800 hours for each of the employment policies s 5 1, 2, . . . , 5 to determine which policy results in the smallest
 expected average cost per hour. Assume that at time 0 all machines have just been
“freshly” repaired.`;
