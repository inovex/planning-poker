echo "Installing missing npm packages"

npm ll --global | grep -q express
if [ $? -ne 0 ]; then
	sudo npm install --global express
fi