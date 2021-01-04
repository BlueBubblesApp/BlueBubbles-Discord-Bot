# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/bionic64"

  config.vm.provider "virtualbox" do |v|
    v.name = "BlueBubbles-Discord-Bot"
    v.memory = 1024
    v.cpus = 1
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
  end

  if Vagrant::Util::Platform.windows?
    config.vm.synced_folder "./", "/vagrant", type: "smb"
  else
    config.vm.synced_folder "./", "/vagrant"
  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
    sudo apt -y install nodejs
    sudo apt -y install build-essential
    sudo npm i -g yarn
    sudo npm i -g pm2
  SHELL

  config.vm.provision "shell", run: "always", inline: <<-SHELL
    cd /vagrant
    yarn
    pm2 start yarn --name "BlueBubbles-Bot" -- start
  SHELL
end