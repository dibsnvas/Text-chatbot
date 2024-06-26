import os
import json
import random

def get_recent_messages():

  file_name = "stored_data.json"
  learn_instruction = {"role": "system", 
                       "content": "You are helping kids with special needs who has diseases and your name is Alma, the user name is Balapan. Keep responses under 20 words. "}
  
  messages = []

  x = random.uniform(0, 1)
  if x < 0.2:
    learn_instruction["content"] = learn_instruction["content"] + "Your response will have some cheer up words. "
  elif x < 0.5:
    learn_instruction["content"] = learn_instruction["content"] + "Your response will include an interesting new fact about world and nature. "
  else:
    learn_instruction["content"] = learn_instruction["content"] + "Your response will recommend games to play in real lifey. "

  messages.append(learn_instruction)

  try:
    with open(file_name) as user_file:
      data = json.load(user_file)
      
      if data:
        if len(data) < 5:
          for item in data:
            messages.append(item)
        else:
          for item in data[-5:]:
            messages.append(item)
  except:
    pass

  
  return messages


def store_messages(request_message, response_message):

  file_name = "stored_data.json"

  messages = get_recent_messages()[1:]

  user_message = {"role": "user", "content": request_message}
  assistant_message = {"role": "assistant", "content": response_message}
  messages.append(user_message)
  messages.append(assistant_message)

  with open(file_name, "w") as f:
    json.dump(messages, f)


def reset_messages():

  file_name = "stored_data.json"
  open(file_name, "w")