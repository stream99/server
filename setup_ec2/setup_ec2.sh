sudo yum update
sudo yum install git
sudo yum install gcc-c++ make
sudo yum install openssl-devel
git clone git://github.com/joyent/node.git
cd node
git checkout v0.12.0
./configure
make
sudo make install
cd ~/
git clone https://github.com/isaacs/npm.git
cd npm
sudo make install

git clone https://github.com/stream99/z.git

sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 2015
