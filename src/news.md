### May 19, 2024 · _Release 1.2.1_

This is a bugfix release that fixes a CSS styling issue with the new "version 2" banner on larger
screens.

### May 19, 2024 · _Release 1.2.0_

This release adds a small banner to the top of the app announcing the development of "version 2" of
the app and provides a link for users to get a preview of the brand new version of the app.

### Feb 1, 2024 · _Release 1.1.0_

The app is working again! It turns out that the Brandmeister network updated their API to use a new
version of Socket IO. Once I updated my client version to match, we were back in business! I also
took the opportunity to bring a bunch of other dependencies up to date.

See the full details [here](https://github.com/alexgladd/bm-hotgroups/releases/tag/1.1.0).

### May 9, 2021 · _Release 1.0.0_

The "v1" release; ready for production! In this release I took care of a couple of custodial tasks
that I had been meaning to do for a while before calling the app "version 1". First, I add this news
section and the companion about section so that users can learn more about the app. I also made the
navigation menu responsive so that it works well on mobile devices. Second, I wanted to take care of
a few different cleanup tasks on the app's site metadata, including a new site icon and a basic
sitemap. Finally, I added integration with [Sentry](https://sentry.io) so I could get notified if
there are any uncaught errors that users encounter in production.

### Apr 25, 2021 · _Release 0.3.1_

This release includes an update to all of the app's dependencies and fixes a typo.

### Apr 25, 2021 · _Release 0.3.0_

The "current activity" release; see real-time network activity. In this release I added a
[feature](https://github.com/alexgladd/bm-hotgroups/issues/3) that lets you see real-time activity
on the Brandmeister network. At a glance, you can see all open sessions including which callsign is
talking to which talkgroup, and for how long. This works well in combination with the top talkgroups
and callsigns aggregations to give you a complete picture of where there's activity on the network.

I also added a control that allows users to clear all data from the aggregation window. This is
useful if you've stepped away for a minute and want to reset things without disconnecting and
reconnecting to the network.

Finally, this release fixes an [issue](https://github.com/alexgladd/bm-hotgroups/issues/23) where
the app wasn't reading data from the network properly anymore. This issue was caused by a change to
the underlying Brandmeister network API. They seem to have made some changes to the way their
session events work.

### Apr 9, 2020 · _Release 0.2.2_

Migration to Github Actions for CI/CD. In this release there are no actual changes to the
Brandmeister Top Activity app itself. Instead, this release migrates the app to use Github Actions
for continuous integration and continuous deployment.

### Feb 1, 2020 · _Release 0.2.1_

You can now enjoy the Brandmeister Top Activity app on your smaller mobile devices! This release
adds responsive layouts for the app so that it adapsts to the smaller screen sizes found on mobile
devices like smartphones and tablet. I know many people like to use the app in the field when they
don't always have a laptop or desktop-size screens available, so I hope this improves your
experience!

For more details, see the [official release notes](https://github.com/alexgladd/bm-hotgroups/releases/tag/0.2.1).

### Jan 26, 2020 · _Release 0.2.0_

The filters release! Now you can filter aggregated talkgroups and callsigns. This release adds a
handful of filter options to both the list of aggregated talk groups and callsigns. For talkgroups,
you can only show groups that have an associated name and you can filter the list by name. For
callsigns, you can only show users that have an associated callsign and/or name, and you can filter
the list by callsign and/or name.

These filters let you quickly scan the lists to find the talkgroups and callsigns that you're most
interested in.

For more details, see the [official release notes](https://github.com/alexgladd/bm-hotgroups/releases/tag/0.2.0).

### Jul 6, 2018 · _Release 0.1.1_

Important bugfix for aggregating last active times for both talkgroups and callsigns. Shortly after
publishing the first public release of my Brandmeister Top Acivity app, I noticed that there
appeared to be an issue where the 'last active' times being shown for talkgroups and callsigns
weren't correct. I added a bunch of test cases to help me narrow down the issue and finally fixed
it.

For more details, see the [official release notes](https://github.com/alexgladd/bm-hotgroups/releases/tag/0.1.1).

### Jul 4, 2018 · _Release 0.1.0_

First official release! I'm happy to announce that the first official release of my Brandmeister Top
Activity app has been published. This app provides an aggregated view of Brandmeister's "last heard"
stream so that you can see which talkgroups and users are currently most active (based on active
talk time).

I plan to keep working on this app to add more features, so let me know what you're interested in
seeing!
