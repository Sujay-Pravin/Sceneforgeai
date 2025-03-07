import os
import sys
import requests
from moviepy.editor import VideoFileClip, concatenate_videoclips, AudioFileClip, CompositeAudioClip
from pydub import AudioSegment
from gtts import gTTS
import google.generativeai as genai
import json

# Ensure required directories exist
os.makedirs("output", exist_ok=True)
os.makedirs("videos", exist_ok=True)
os.makedirs("audio", exist_ok=True)
os.makedirs("bgm", exist_ok=True)

PEXELS_API_KEY = "zqFVsPWhkZp5pcAj7LMzxpks3u732B2Xhj7i4ZRnCSuPil8MjfIF3Hxv"
PEXELS_VIDEO_API_URL = "https://api.pexels.com/videos/search"
GEMINI_API_KEY = "AIzaSyBS8iW-kJMrSQrQ90WVoM-xAXPBLEiO5OI"

genai.configure(api_key=GEMINI_API_KEY)

def generate_script(prompt):
    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    api_prompt = f"Create a concise script for a video on {prompt}. Describe each key moment using clear and simple sentences, without explicitly labeling scenes or numbering them. Present the script as a single paragraph, ensuring all sentences are complete, end with a period, and avoid using line breaks or slashes"
    response = model.generate_content([api_prompt])
    print(api_prompt)
    return response.text.strip()

def split_script(script):
    return script.split(". ")

def fetch_videos(query, index, num_videos=2):
    headers = {"Authorization": PEXELS_API_KEY}
    params = {"query": query, "per_page": num_videos}

    response = requests.get(PEXELS_VIDEO_API_URL, headers=headers, params=params)
    data = response.json()
    video_paths = []

    if "videos" in data and data["videos"]:
        for i, video in enumerate(data["videos"][:num_videos]):
            try:
                video_url = video["video_files"][0]["link"]
                video_path = f"videos/scene_{index}_{i}.mp4"
                video_data = requests.get(video_url).content
                with open(video_path, "wb") as handler:
                    handler.write(video_data)
                video_paths.append(video_path)
            except Exception as e:
                print(f"Error fetching video {i}: {e}")

    return video_paths

def generate_media(scenes):
    media_files = []
    for i, scene in enumerate(scenes):
        video_paths = fetch_videos(scene, i)
        media_files.append(video_paths)
    return media_files

def generate_audio(scenes):
    audio_files = []
    for i, scene in enumerate(scenes):
        try:
            tts = gTTS(text=scene, lang='en')
            audio_path = f"audio/scene_{i}.mp3"
            tts.save(audio_path)
            audio_files.append(audio_path)
        except Exception as e:
            print(f"Error generating audio: {e}")
    return audio_files

def merge_media_audio(media_files, audio_files, bgm_path="/content/sax-pleasant-rhythms-9032.mp3"):
    clips = []

    bgm = None
    if os.path.exists(bgm_path):
        bgm = AudioFileClip(bgm_path).volumex(0.3)
        print(f" Using background music: {bgm_path}")
    else:
        print(" No background music file found. Proceeding without BGM.")

    for i, (video_paths, audio_path) in enumerate(zip(media_files, audio_files)):
        if not video_paths:
            continue

        try:
            video_clips = [VideoFileClip(v).resize(height=720) for v in video_paths]
            if not video_clips:
                continue

            final_scene = concatenate_videoclips(video_clips, method="compose")

            audio = AudioFileClip(audio_path)
            if bgm:
                audio = CompositeAudioClip([audio, bgm.set_duration(audio.duration)])

            final_scene = final_scene.set_audio(audio.set_duration(final_scene.duration))
            clips.append(final_scene)

        except Exception as e:
            print(f" Error processing scene {i}: {e}")

    if not clips:
        print(" No valid video clips to merge.")
        return

    final_video = concatenate_videoclips(clips, method="compose")
    final_video.write_videofile("output/final_video.mp4", codec="libx264", fps=24)
    print("✅ Video successfully generated at output/final_video.mp4")

def main():
    if len(sys.argv) < 2:
        print("Error: No script provided")
        sys.exit(1)

    try:
        # Get the script from command line argument
        script = sys.argv[1]
        
        # Split the script into scenes
        scenes = [scene.strip() for scene in script.split(',') if scene.strip()]
        
        if not scenes:
            raise ValueError("No valid scenes found in the script")

        print(f"Processing {len(scenes)} scenes...")
        
        # Generate media for each scene
        media_files = generate_media(scenes)
        audio_files = generate_audio(scenes)
        
        # Merge media and audio
        merge_media_audio(media_files, audio_files)
        
        print(json.dumps({
            "status": "success",
            "message": "Video generated successfully",
            "scenes_processed": len(scenes)
        }))

    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()