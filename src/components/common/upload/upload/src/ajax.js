function getError(action, option, xhr) {
  let msg;
  if (xhr.response) {
    msg = `${xhr.status} ${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.status} ${xhr.responseText}`;
  } else {
    msg = `fail to post ${action} ${xhr.status}`;
  }

  const err = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = action;
  return err;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

export default function upload(option, formData, http) {
  http.post('/qingstor/pre', formData).then(res => {
    this.uploadUrl = res.data.apiUrl;
    this.uploadData = {
      policy: res.data.policy,
      access_key_id: res.data.accessKeyId,
      signature: res.data.signature,
      key: res.data.key
      // redirect: res.data.redirect
    };

    if (typeof XMLHttpRequest === 'undefined') {
      return;
    }

    const xhr = new XMLHttpRequest();
    const action = this.uploadUrl;// option.action;

    if (xhr.upload) {
      xhr.upload.onprogress = function progress(e) {
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }
        option.onProgress(e);
      };
    }

    const formData = new FormData();

    if (this.uploadData) {
      Object.keys(this.uploadData).forEach(key => {
        formData.append(key, this.uploadData[key]);
      });
    }

    formData.append(option.filename, option.file);

    xhr.onerror = function error(e) {
      option.onError(e);
    };
    xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
        return option.onError(getError(action, option, xhr));
      }
      http.get(res.data.redirect).then(res1 => {
        option.onSuccess(res1.data);
      });
      // option.onSuccess(getBody(xhr));
    };

    xhr.open('post', action, true);

    if (option.withCredentials && 'withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    const headers = option.headers || {};

    for (let item in headers) {
      if (headers.hasOwnProperty(item) && headers[item] !== null) {
        xhr.setRequestHeader(item, headers[item]);
      }
    }
    xhr.send(formData);
    return xhr;
  });
}
