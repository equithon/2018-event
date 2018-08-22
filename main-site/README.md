# Equithon 2018

<<<<<<< HEAD
The second iteration of Waterloo's social innovation hackathon. Each subfolder contains a specific project developed for the event, with commit history for each project as a separate branch.
 
=======
To install Meteor, follow this [link](https://www.meteor.com/install) and run the right command.

To run the meteor server, use
```bash
$ meteor npm install
$ meteor --settings settings.json
```
and go to `localhost:3000`.

## Deploying the App ##
To deploy the meteor application, you will need to setup the necessary command line tools including
  - awscli
  - ebcli
Install the AWS and AWS EB CLIs (look at the documentation of each for how to install). Then configure
them by running `aws configure`. You will need to have your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_KEY` on you
or saved in `~/.aws/credentials` (see docs).

You can use the `build_and_deploy.sh` script to create new application versions and deploy them. Its usage is as follows
```bash
./build_and_deploy.sh STAGING APP_VERSION_LABEL [APP_VERSION_DESCRIPTION]
./build_and_deploy.sh PRODUCTION APP_VERSION_LABEL
```
<<<<<<< HEAD
This will build the nodejs bundle using `meteor build` and deploy to elastic beanstalk using `eb deploy`.
The ENVIRONMENT parameter for now is STAGING. Once we get the production server up we will add another environment.
>>>>>>> Added AWS EB configuration files and build-deployment script that builds and deploys the app. Only STAGING for now.
=======
Depending on whether your are deploying to staging or to production, the script requires different parameters.
For both staging and production deployments, you must specify an application version label.
  - When deploying to staging, this label may be a non-existing one and the script will proceed to build and deploy a new
  application version with that label. You can also optionally specify an application version description when creating a
  new application version.
  - When deploying to production, this label must be an existing application version. The script will not attempt to
  a new application version to deploy (we want to deploy the same exact build from staging to production, not have to create
  a new one).

### Note on Security: ###
The two packages `insecure` and `autopublish` are very useful for developing and debugging as they expose the entire
database locally onto the client. However they are obviously very insecure and bad to have in production builds. Thus we won't
check them into source code to keep safe. If you need them when developing, run `meteor add insecure` and `meteor add autopublish`
to get them back. Committing them is not that big of a deal as the script attempts to remove both packages anyway before building.
>>>>>>> Deployment to production and removal of autopublish
