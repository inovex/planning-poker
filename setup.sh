echo "Installing missing npm packages"

function install_npm_package {
	echo "Checking npm package $1"
	npm ll | grep -q $1
	if [ $? -ne 0 ]; then
		sudo npm install $1
	fi	
}

install_npm_package express
install_npm_package ejs