/**
 * Episode watched monitor
 * Count all episodes watched for a season when changes occur, flip switches accordingly.
 * Rest of the entity implementation and other tweaks left open for @garfield69 to fill
 */
DuckieTV.run(function($rootScope) {

    function reCount(ID_Serie, ID_Season) {
        var db = CRUD.EntityManager.getAdapter().db;
        db.execute("select ID_Season, watched, count(watched) as amount from Episodes where ID_Serie = ? GROUP BY ID_Season, watched", [ID_Serie]).then(function(counts) {
            console.log("counts: ", counts.rs.rows);
            var seasons = {};
            for (var i = 0; i < counts.rs.rows.length; i++) {
                var row = counts.rs.rows.item(i);
                with(row) {
                    if (!(ID_Season in seasons)) {
                        seasons[ID_Season] = {};
                    }
                    if (watched === 0) {
                        seasons[ID_Season].total = amount;
                    } else {
                        seasons[ID_Season].watched = amount;
                    }
                }
            }
            var seasonsWatched = 0;
            Object.keys(seasons).map(function(season, num) {
                CRUD.FindOne('Season', {
                    ID_Season: num
                }).then(function(s) {

                    if (!season.total) { // all items in season watched.
                        // s.watched = 1;
                        seasonsWatched++;
                    } else {
                        // s.watched = 0;
                    }
                    // s.Persist();
                });
            });
            CRUD.FindOne('Serie', {
                ID_Serie: ID_Serie
            }).then(function(serie) {
                if (seasonsWatched == Object.keys(seasons).length) {
                    //serie.watched = 1;
                    //serie.Persist();
                    // mark serie watched here.
                }
            });
        });
    }


    /**
     * Catch the event when an episode is marked as watched
     */
    $rootScope.$on('episode:marked:watched', function(evt, episode) {
        reCount(episode.ID_Serie, episode.ID_Season);
    });
    /**
     * Catch the event when an episode is marked as NOT watched
     */
    $rootScope.$on('episode:marked:notwatched', function(evt, episode) {
        reCount(episode.ID_Serie, episode.ID_Season);
    });


})