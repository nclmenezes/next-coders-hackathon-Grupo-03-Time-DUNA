import ReactPlayer from 'react-player';


interface props {
  height?: string,
  width?: string,
  url?: string

}
function Player({height, width, url}: props) {
  const cleanUrl = url ? url.split('&list=')[0] : '';
  
  if (!url) {
    return <div>URL do vídeo não fornecida</div>;
  }
  
  return (
            <ReactPlayer
            url={cleanUrl}
            controls={true}
            height={height}
            width={width}
            playing={false}
            onError={(error) => console.error('ReactPlayer Error:', error)}
            config={{
              youtube: {
                playerVars: {
                  showinfo: 1,
                  modestbranding: 1,
                }
              }
            }}
            />
  )
}

export default Player