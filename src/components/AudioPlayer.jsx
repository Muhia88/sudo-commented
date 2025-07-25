// src/components/AudioPlayer.jsx

// Imports React and several hooks for state management, refs, and effects. `forwardRef` and `useImperativeHandle` are used to expose component functions to a parent.
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
// Imports icons for the play/pause button.
import { FaPlay, FaPause } from 'react-icons/fa';

// Helper function to format seconds into a MM:SS string.
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) {
    return '0:00';
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  // Pad the seconds with a leading zero if needed.
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};



// Defines the AudioPlayer component, wrapped in `forwardRef` to allow parent components to get a ref to it.
/*forwardRef: This is a special React function that lets a parent component (like AudioBookDetail)
 get a ref to a child component. It's necessary here so the parent can call the saveCurrentTime function.
  The ref is passed as a second argument to the component function. */
const AudioPlayer = forwardRef(({ audioUrl, startTime, onSave }, ref) => {
  // State to track whether the audio is currently playing.
  const [isPlaying, setIsPlaying] = useState(false);
  // State to track the playback progress as a percentage (0-100).
  const [progress, setProgress] = useState(0);
  // State to track the current playback time in seconds.
  const [currentTime, setCurrentTime] = useState(startTime || 0);
  // A ref to hold a reference to the HTML <audio> element.
  const audioRef = useRef(null);

  // An effect that runs when the audio source (audioUrl) or the initial start time changes.
  /*This hook runs whenever the audioUrl (the chapter) or the startTime changes. Its job is to 
  reset the player for the new track. It pauses playback (setIsPlaying(false)), 
  resets the progress bar visually (setProgress(0)), and sets the audio element's time 
  to the startTime provided (which will be 0 for a new chapter or a saved time if resuming). */
  useEffect(() => {
    // If the audio element exists...
    if (audioRef.current) {
      // ...pause the player, reset the progress bar, and set the current time to the new start time.
      setIsPlaying(false);
      setProgress(0);
      audioRef.current.currentTime = startTime || 0;
    }
  }, [audioUrl, startTime]);

  // Function to toggle between play and pause.
  /*Checks the isPlaying state. If true, it calls audioRef.current.pause().
   If false, it calls audioRef.current.play().It then flips the isPlaying state by 
   calling setIsPlaying(!isPlaying). */
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    // Toggles the isPlaying state.
    setIsPlaying(!isPlaying);
  };

  // Function that is called continuously as the audio plays to update the progress.
  /*This function is connected to the <audio> element's onTimeUpdate event, which fires repeatedly as the audio plays.

  It calculates the progress percentage ((currentTime / duration) * 100) 
  and updates both the progress and currentTime states,
  causing the slider and time display to update in real-time. */
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio.duration) {
      // Calculates and sets the progress percentage.
      setProgress((audio.currentTime / audio.duration) * 100);
      // Updates the current time state.
      setCurrentTime(audio.currentTime);
    }
  };

  // Function to handle the user manually seeking through the audio with the range input.
  /*This function is called when the user drags the slider.
  It takes the new value from the slider (0-100) and does the reverse calculation to 
  figure out the corresponding time in seconds.
  It then sets audioRef.current.currentTime to that new time, making the audio jump to that position. */
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    if (audioRef.current.duration) {
      // Calculates the new time based on the slider's position and sets it on the audio element.
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      // Updates the progress state.
      setProgress(newProgress);
    }
  };

  // Exposes the `saveCurrentTime` function to the parent component via the ref.
  /*This hook is used with forwardRef. It customizes the instance value that is exposed to parent components when they use the ref.

Here, it exposes an object with a single method: saveCurrentTime.

When the parent component calls playerRef.current.saveCurrentTime(), 
this function is executed. It gets the current playback time from the <audio> element 
(audioRef.current.currentTime) and passes it up to the parent by calling the onSave function
 that was passed in as a prop. */
  useImperativeHandle(ref, () => ({
    saveCurrentTime() {
      // Calls the onSave function passed down from the parent with the current time.
      onSave(audioRef.current.currentTime);
    }
  }));

  // Returns the JSX for the audio player.
  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-4">
      {/* The HTML <audio> element, which is not visible to the user but handles the actual playback. */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => {
          // When new audio is loaded, set its start time
          if (audioRef.current) {
            audioRef.current.currentTime = startTime || 0;
            setProgress((startTime / audioRef.current.duration) * 100 || 0)
          }
        }}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* The visible UI for the player. */}
      <div className="flex items-center space-x-4">
        {/* The play/pause button. */}
        <button
          onClick={togglePlay}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 transition-transform transform hover:scale-110"
        >
          {/* Conditionally renders the Pause or Play icon based on the isPlaying state. */}
          {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
        </button>

        {/* Display Current Time */}
        <span className="text-sm text-gray-600 w-12 text-center">
          {formatTime(currentTime)}
        </span>

        {/* The range input that serves as the progress/seek bar. */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          // A style to make the track of the range input show the progress.
          style={{
            background: `linear-gradient(to right, #8B5CF6 ${progress}%, #d1d5db ${progress}%)`
          }}
        />
        {/* Display Total Duration */}
        <span className="text-sm text-gray-600 w-12 text-center">
          {audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}
        </span>
      </div>
    </div>
  );
});

// Exports the AudioPlayer component.
export default AudioPlayer;