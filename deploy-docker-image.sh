if [ $# -eq 0 ]; then
    >&2 echo "Environment not provided. e.g. -e dev"
    exit 1
fi

while getopts e: flag
do
    case "${flag}" in
        e) env=${OPTARG};;
    esac
done

NG_BUILD_ENV=""

if [ "$env" = "dev" ]; then 
    NG_BUILD_ENV="development"
elif [ "$env" = "prod" ]; then 
    NG_BUILD_ENV="production"
else 
    >&2 echo "Not supported environment"
    exit 1
fi

readonly IMAGE_NAME="frontend-app-$env"

echo "Building and publishing $IMAGE_NAME image"

rm -rf dist &&\
ng build -c $NG_BUILD_ENV &&\
docker build -t $IMAGE_NAME . &&\
doctl registry login &&\
docker tag $IMAGE_NAME registry.digitalocean.com/container-registry-smallstepdiet/frontend-app-$env &&\
docker push registry.digitalocean.com/container-registry-smallstepdiet/frontend-app-$env
