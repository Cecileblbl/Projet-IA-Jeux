# Queueing

## Description du comportement

The queuing results from a steering behavior which produces braking (deceleration) when the vehicle detects other vehicles which are: nearby, in front of, and moving slower than itself.

In addition these vehicles are drawn toward the "doorway" by seek behavior, they avoid the gray walls, and maintain separation from each other.

A kinematic interpenetration constraint prevents them from overlapping with each other or the walls.
