sudo yum -y update

echo "[MongoDB]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0
enabled=1" | sudo tee -a /etc/yum.repos.d/mongodb.repo

sudo yum install -y mongodb-org-server mongodb-org-shell mongodb-org-tools

sudo mkdir /var/lib/mongo/data
sudo mkdir /var/lib/mongo/log
sudo mkdir /var/lib/mongo/journal

sudo chown mongod:mongod /var/lib/mongo/data
sudo chown mongod:mongod /var/lib/mongo/log
sudo chown mongod:mongod /var/lib/mongo/journal


