import React, { useState, useEffect } from "react";
import "../HeaderAuthSnippets.css";

const HeaderAuthSnippets = () => {
  const [endpoint, setEndpoint] = useState("http://127.0.0.1:2400/ethix_gatekeeper");
  const [apiName, setApiName] = useState("EthicalPay");
  const [apiKey, setApiKey] = useState("ethixdssnsdvk0124840");
  const [targetUrl, setTargeUrl] = useState("https://your-app.com/target");
  const [redirectUrl, setRedirectUrl] = useState("https://your-app.com/fallback");
  const [language, setLanguage] = useState("bash");
  const [snippet, setSnippet] = useState("");

  const escapeShell = (s) => s.replace(/(["\\$`])/g, "\\$1");
  const escapeJS = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
  const escapeQuotes = (s) => s.replace(/"/g, '\\"');
  const escapeJava = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const escapeCSharp = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const escapePHP = (s) => s.replace(/"/g, '\\"');

  const buildSnippets = () => {
    const url = endpoint.trim();
    const name = apiName.trim();
    const key = apiKey.trim();
    const redir = redirectUrl.trim();

    return {
      bash: `curl -X GET ${escapeShell(url)} \\
  -H "x-api-name: ${escapeShell(name)}" \\
  -H "x-api-key: ${escapeShell(key)}"${redir ? ` \\\n  -H "x-redirect-url: ${escapeShell(redir)}"` : ""}`,

      javascript: `fetch("${escapeJS(url)}", {
  method: "GET",
  headers: {
    "x-api-name": "${escapeJS(name)}",
    "x-api-key": "${escapeJS(key)}"${redir ? `,\n    "x-redirect-url": "${escapeJS(redir)}"` : ""}
  }
}).then(async (r) => {
  const txt = await r.text();
  console.log(r.status, txt); // "safe" or "unsafe"
}).catch(console.error);`,

      node: `const axios = require("axios");

axios.get("${escapeJS(url)}", {
  headers: {
    "x-api-name": "${escapeJS(name)}",
    "x-api-key": "${escapeJS(key)}"${redir ? `,\n    "x-redirect-url": "${escapeJS(redir)}"` : ""}
  },
}).then(res => {
  console.log(res.status, res.data);
}).catch(err => {
  console.error(err.response?.status, err.response?.data || err.message);
});`,

      python: `import requests

headers = {
  "x-api-name": "${escapeQuotes(name)}",
  "x-api-key": "${escapeQuotes(key)}"${redir ? `,\n  "x-redirect-url": "${escapeQuotes(redir)}"` : ""}
}
resp = requests.get("${escapeQuotes(url)}", headers=headers)
print(resp.status_code, resp.text)  # "safe" or "unsafe"`,

      go: `package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  req, _ := http.NewRequest("GET", "${url}", nil)
  req.Header.Set("x-api-name", "${name}")
  req.Header.Set("x-api-key", "${key}")${redir ? `\n  req.Header.Set("x-redirect-url", "${redir}")` : ""}

  resp, err := http.DefaultClient.Do(req)
  if err != nil { panic(err) }
  defer resp.Body.Close()
  body, _ := ioutil.ReadAll(resp.Body)
  fmt.Println(resp.StatusCode, string(body))
}`,

      rust: `use reqwest::blocking::Client;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let resp = client
        .get("${url}")
        .header("x-api-name", "${name}")
        .header("x-api-key", "${key}")${redir ? `\n        .header("x-redirect-url", "${redir}")` : ""}
        .send()?;

    let status = resp.status();
    let text = resp.text()?;
    println!("{} {}", status.as_u16(), text);
    Ok(())
}`,

      java: `import java.net.http.*;
import java.net.URI;

public class Main {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest req = HttpRequest.newBuilder()
      .uri(URI.create("${escapeJava(url)}"))
      .header("x-api-name", "${escapeJava(name)}")
      .header("x-api-key", "${escapeJava(key)}")${redir ? `\n      .header("x-redirect-url", "${escapeJava(redir)}")` : ""}
      .GET()
      .build();

    HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
    System.out.println(resp.statusCode() + " " + resp.body());
  }
}`,

      csharp: `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
  static async Task Main() {
    using var http = new HttpClient();
    var req = new HttpRequestMessage(HttpMethod.Get, "${escapeCSharp(url)}");
    req.Headers.Add("x-api-name", "${escapeCSharp(name)}");
    req.Headers.Add("x-api-key", "${escapeCSharp(key)}");${redir ? `\n    req.Headers.Add("x-redirect-url", "${escapeCSharp(redir)}");` : ""}
    var resp = await http.SendAsync(req);
    var body = await resp.Content.ReadAsStringAsync();
    Console.WriteLine($"{(int)resp.StatusCode} {body}");
  }
}`,

      php: `<?php
$ch = curl_init("${escapePHP(url)}");
$headers = [
  "x-api-name: ${escapePHP(name)}",
  "x-api-key: ${escapePHP(key)}"${redir ? `,\n  "x-redirect-url: ${escapePHP(redir)}"` : ""}
];
curl_setopt_array($ch, [
  CURLOPT_HTTPHEADER => $headers,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo $code . " " . $resp;`,

      ruby: `require "net/http"
require "uri"

uri = URI.parse("${url}")
req = Net::HTTP::Get.new(uri)
req["x-api-name"] = "${name}"
req["x-api-key"]  = "${key}"${redir ? `\nreq["x-redirect-url"] = "${redir}"` : ""}

res = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
  http.request(req)
end

puts "#{res.code} #{res.body}"`
    };
  };

  useEffect(() => {
    setSnippet(buildSnippets()[language]);
  }, [endpoint, apiName, apiKey, redirectUrl, language]);

  const copyCode = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      const btn = document.getElementById("copyBtn");
      btn.classList.add("copied");
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "Copy";
      }, 1600);
    });
  };

  return (
    <div className="wrap">
      <h1>Ethixion Gatekeeper — Header Authentication</h1>
      <p className="lead">
        Send a request to your Gatekeeper endpoint with these headers. If
        validated, you’ll receive a <code className="k">safe</code> status;
        otherwise <code className="k">unsafe</code>.
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Header</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code className="k">x-api-name</code></td>
            <td>Your registered API name</td>
          </tr>
          <tr>
            <td><code className="k">x-api-key</code></td>
            <td>Your API key</td>
          </tr>
          <tr>
            <td><code className="k">x-redirect-url</code></td>
            <td>(Optional) Alternate redirect if request fails</td>
          </tr>
        </tbody>
      </table>
      <div className="snippet">
        <div className="snippet-toolbar">
          <div className="left">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="bash">cURL (Bash)</option>
              <option value="javascript">JavaScript (Fetch)</option>
              <option value="node">Node.js (Axios)</option>
              <option value="python">Python (requests)</option>
              <option value="go">Go (net/http)</option>
              <option value="rust">Rust (reqwest)</option>
              <option value="java">Java (HttpClient)</option>
              <option value="csharp">C# (.NET HttpClient)</option>
              <option value="php">PHP (cURL)</option>
              <option value="ruby">Ruby (Net::HTTP)</option>
            </select>
            <small className="hint">Edit values above — snippet updates live.</small>
          </div>
          <div className="right">
            <button id="copyBtn" onClick={copyCode}>Copy</button>
          </div>
        </div>
        <div className="codebox">
          <pre><code>{snippet}</code></pre>
        </div>
      </div>

      <br />
      <h1>Ethixion Gatekeeper - Form Authentication</h1>
      <div className="row">
        <div className="inp">
          <label>Endpoint URL</label>
          <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} disabled />
          <p className="hint">Hint: Form Action</p>
        </div>
        <div className="inp">
          <label>API Name</label>
          <input value={apiName} onChange={(e) => setApiName(e.target.value)} disabled />
          <p className="hint">Hint: Form Input name attribute - apiname</p>
        </div>
        <div className="inp">
          <label>API Key</label>
          <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} disabled />
          <p className="hint">Hint: Form Input name attribute - apikey</p>
        </div>
        <div className="inp">
          <label>Target URL</label>
          <input value={targetUrl} onChange={(e) => setRedirectUrl(e.target.value)} disabled />
          <p className="hint">Hint: Form Input name attribute - redirect_url</p>
        </div>
        <div className="inp">
          <label>Redirect Fallback (Optional)</label>
          <input value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} disabled />
          <p className="hint">Hint: Form Input name attribute - original_url</p>
        </div>
      </div>



      <p className="hint">
        Note: If your Gatekeeper is configured to redirect on deny, client
        libraries may follow or expose the redirect URL differently.
      </p>
    </div>
  );
};

export default HeaderAuthSnippets;
