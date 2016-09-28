#!/usr/bin/env node

var fs = require('fs');
var child = require('child_process');
var config = require('./configuration');
var github = require('githubhook')({
  'path': '/',
  'port': config.get('port'),
  'secret': config.get('secret'),
  'logger': console
});

function getDefaultRegistry() {
    var one = {
        repo: process.argv[2]
    };

    var script = process.argv[3];
    if (script) {
        var splits = script.split(" ");
        one.script = splits[0];

        var args = splits.slice(1);
        if (args.length > 0) {
            one.args = args;
        }
    }

    return [one];
}

var registry = config.get('registry') || getDefaultRegistry();


function usage() {
  console.log("Usage: %s </path/to/repo> [</path/to/post-deploy.sh>]", process.argv[1]);
  process.exit(1);
}

var allEntiresHaveRepo = registry.every((x) => {
    return x.repo != null;
});
if (!allEntiresHaveRepo) {
 usage();
}

foreach (var dir in registry.map((x) => {return x.repo;})) {
    fs.stat(dir, function(err, stats) {
      // dir must exist
      if (err) {
        console.error(err);
        usage();
      }

      // dir must be git repo
      fs.stat(dir + '/.git', function(err, stats) {
        if (err) {
          console.error(dir, 'is not a git repo');
          usage();
        }
      });
    });
}
github.listen();
github.on('push', function(repo, ref, data) {
  // TODO: Check repo is the repo in dir
  //
  // TODO: Lookup the repo in the registry
  condole.log(JSON.stringify(arguments));
  // var sha = data.after;
  //
  // var command = 'git fetch && git checkout ' + sha;
  // child.exec(command, { cwd: dir }, function(err, stdout, stderr) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.error(stderr);
  //     console.log(stdout);
  //
  //     if (script) {
  //       child.exec(script, { cwd: dir }, function(err, stdout, stderr) {
  //         if (err) {
  //           console.error(err);
  //         } else {
  //           console.error(stderr);
  //           console.log(stdout);
  //         }
  //       });
  //     }
  //   }
  // });
});
