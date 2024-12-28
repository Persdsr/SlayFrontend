import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import ControlIcons from './course/ControlIcons';

const VideoPlayer = ({ videoUrl, title }) => {
    const [playerState, setPlayerState] = useState({
        playing: false,
        muted: false,
        volume: 0.5,
        playbackRate: 1.0,
        played: 0,
        seeking: false,
    });
    const [controlsVisible, setControlsVisible] = useState(true);
    const playerRef = useRef(null);
    const playerDivRef = useRef(null);

    useEffect(() => {
        let timer;
        if (controlsVisible && playerState.playing) {
            timer = setTimeout(() => {
                hideControls();
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [controlsVisible, playerState.playing]);

    const showControls = () => {
        setControlsVisible(true);
    };

    const hideControls = () => {
        if (playerState.playing) {
            setControlsVisible(false);
        }
    };

    const handleMouseEnter = () => {
        showControls();
    };

    const handleMouseLeave = () => {
        hideControls();
    };

    const handleMouseMove = () => {
        showControls();
    };

    const handlePlayPause = () => {
        setPlayerState((prev) => ({ ...prev, playing: !prev.playing }));
        showControls();
    };

    const handlePlayerClick = (e) => {
        if (e.target.classList.contains('clickable-area')) {
            handlePlayPause();
        }
    };

    const handleMuting = () => {
        setPlayerState((prev) => ({ ...prev, muted: !prev.muted }));
    };

    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 30);
    };

    const handleVolumeChange = (e, newValue) => {
        const volume = parseFloat(newValue / 100);
        setPlayerState((prev) => ({
            ...prev,
            volume,
            muted: newValue === 0,
        }));
    };

    const handlePlayerRate = (rate) => {
        setPlayerState((prev) => ({ ...prev, playbackRate: rate }));
    };

    const handlePlayerProgress = (state) => {
        if (!playerState.seeking) {
            setPlayerState((prev) => ({ ...prev, ...state }));
        }
    };

    const handlePlayerSeek = (e, newValue) => {
        setPlayerState((prev) => ({ ...prev, played: parseFloat(newValue / 100) }));
        playerRef.current.seekTo(parseFloat(newValue / 100));

    };

    const handlePlayerMouseSeekDown = () => {
        setPlayerState((prev) => ({ ...prev, seeking: true }));
    };

    const handlePlayerMouseSeekUp = (e, newValue) => {
        setPlayerState((prev) => ({ ...prev, seeking: false }));
        playerRef.current.seekTo(newValue / 100);
    };

    const handlePlayerMouseSeekMove = (e, newValue) => {
        playerRef.current.seekTo(newValue / 100);
    };

    const handleFullScreenMode = () => {
        if (playerDivRef.current) {
            screenfull.toggle(playerDivRef.current);
        }
    };

    let currentPlayerTime = playerRef.current ? playerRef.current.getCurrentTime() : 0;
    const movieDuration = playerRef.current ? playerRef.current.getDuration() : 0;

    const format = (seconds) => {
        if (isNaN(seconds)) {
            return '00:00';
        }
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        } else {
            return `${mm}:${ss}`;
        }

    };

    let playedTime = format(currentPlayerTime);
    const fullMovieTime = format(movieDuration);

    return (
        <div
            className="playerDiv"
            ref={playerDivRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{ position: 'relative' }}
        >
            <div
                className="clickable-area"
                onClick={handlePlayerClick}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                }}
            />
            <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={playerState.playing}
                volume={playerState.volume}
                playbackRate={playerState.playbackRate}
                onProgress={handlePlayerProgress}
                muted={playerState.muted}
                width="100%"
                height="100%"
                max-height="100px"
            />
            <div className={`controls ${controlsVisible ? 'visible' : 'hidden'}`}>
                <ControlIcons
                    title={title}
                    playandpause={handlePlayPause}
                    playing={playerState.playing}
                    fastForward={handleFastForward}
                    muting={handleMuting}
                    muted={playerState.muted}
                    volumeChange={handleVolumeChange}
                    volumeSeek={handleVolumeChange}
                    volume={playerState.volume}
                    playerbackRate={playerState.playbackRate}
                    playRate={handlePlayerRate}
                    fullScreenMode={handleFullScreenMode}
                    played={playerState.played}
                    onSeek={handlePlayerSeek}
                    onSeekMouseUp={handlePlayerMouseSeekUp}
                    onSeekMouseDown={handlePlayerMouseSeekDown}
                    onSeekMouseMove={handlePlayerMouseSeekMove} // Новый обработчик
                    playedTime={playedTime}
                    fullMovieTime={fullMovieTime}
                    seeking={playerState.seeking}
                />
            </div>
            <style jsx>{`
                .controls {
                    transition: opacity 0.5s ease, visibility 0.5s ease;
                    opacity: 0;
                    visibility: hidden;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                }
                .controls.visible {
                    opacity: 1;
                    visibility: visible;
                }
                .controls.hidden {
                    opacity: 0;
                    visibility: hidden;
                }
            `}</style>
        </div>
    );
};

export default VideoPlayer;
