import { Client } from 'minio'

interface MinIOParams {
  endPoint: string,
  port: number,
  useSSL: boolean,
  accessKey: string,
  secretKey: string
}

const connect = (MinIOParams: MinIOParams): Client => {
  return new Client({
    endPoint: MinIOParams.endPoint,
    port: MinIOParams.port,
    useSSL: MinIOParams.useSSL,
    accessKey: MinIOParams.accessKey,
    secretKey: MinIOParams.secretKey
  })
}

const start = async () => {

  try {

    let minIO: MinIOParams = {
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: '12345678',
      secretKey: '12345678'
    }

    // connect
    let client = connect(minIO)

    // get all buckets
    let buckets = await client.listBuckets()

    if (!buckets.find(item => item.name === 'test')) {
      // create new Bucket
      await client.makeBucket('test', 'eu-central-1')
    }

    // image is putting to min.io
    await client.fPutObject('test', 'image.png', `${process.cwd()}/image.png`, {})

    // image is coming your directiory
    await client.fGetObject('test', 'image.png', `${process.cwd()}/storage/tmp/image.png`)

    // Get Image Public Url
    console.log(await client.presignedUrl('GET', 'test', 'image.png'))

    // Your bucket removing
    await client.removeBucket('test')

  } catch (error) {
    console.log(error)
  }
}

start()
