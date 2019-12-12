#!/bin/sh
if [ ! -n "$1" ]; then
  echo 'usage:autogen yours.proto devGroup projectName'
  exit 1
fi
AoName=$(echo $1 | cut -d \. -f 1)
AoName=$(echo $AoName | sed 's/\b[a-z]/\u&/g')
protocName=$1
prjName=$3
pkgName=gitlab.xinhulu.com/$2/$3
if [ -z "$prjName" ]; then
  echo "projectName is empty,usage:autogen yours.proto devGroup projectName"
  exit 1
fi

mkdir -p $prjName
mkdir -p $prjName/proto

mkdir -p $prjName/$AoName
mkdir -p $prjName/$AoName/server
mkdir -p $prjName/$AoName/client
mkdir -p $prjName/$AoName/logic
mkdir -p $prjName/$AoName/config
touch $prjName/$AoName/config/.gitkeep

cp $1 $prjName/proto/

if [ ! -z $PROTOPATH ]; then
  IShell="-I="$PROTOPATH
else
  IShell=""
fi

protoc $IShell -I=. --autogo_out=./$prjName/proto ${protocName}
protoc $IShell -I=. --automicro_out=./$prjName/proto ${protocName}
protoc $IShell -I=. --muc_out=plugins=mucserver,project=${pkgName}:./$prjName/${AoName}/server ${protocName}
protoc $IShell -I=. --muc_out=plugins=mucclient,project=${pkgName}:./$prjName/${AoName}/client ${protocName}
protoc $IShell -I=. --muc_out=plugins=muclogic,project=${pkgName}:./$prjName/${AoName}/logic ${protocName}

for i in $(ls | grep .proto); do
  if [ "$i" = "$protocName" ]; then
    continue
  fi  
  protoc $IShell -I=. --autogo_out=./$prjName/proto ${i}
  protoc $IShell -I=. --automicro_out=./$prjName/proto ${i}
done

cd $prjName
if [ ! -f "go.mod" ]; then
  go mod init $pkgName
  go get gitlab.xinhulu.com/platform/GoPlatform@master
fi

echo finished
