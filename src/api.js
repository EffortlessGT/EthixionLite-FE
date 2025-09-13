const addr = "https://ethixionlite-be-production.up.railway.app";
export const loginForm = async (data) => {
  const resp = await fetch(`${addr}/login`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const rs = await resp.json();

  if (resp.ok && rs.status) {
    //alert('Valid Credentials.');
    window.location = '/dashboard';
  } else {
    alert('Invalid Username or Password!');
  }

  if (!resp.ok) {
    throw new Error("Network response was not ok");
  }

  return rs;
};
export const loginFormII = async (data) => {
  const resp = await fetch(`${addr}/google_login`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const rs = await resp.json();

  if (resp.ok && rs.status) {
    window.location = '/dashboard';
  } else {
    alert('Invalid Username!');
  }

  if (!resp.ok) {
    throw new Error("Network response was not ok");
  }

  return rs;
};


export const registrationForm = async (data) => {
  const resp = await fetch(`${addr}/registration`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const res = await resp.json();
  if (resp.ok) {
    //alert('Registration Successfull. Kindly Login to Ethixion for accessing services.');
    return res;
  }
  if (!resp.ok) {
    throw new Error("Network response was not ok");
  }

  return await resp.text();
};

export const VerifyUserAccount = async (token) => {
  const resp = await fetch(`${addr}/verify_account?token=${encodeURIComponent(token)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error(rs.msg || "Verification failed");
  }
};


export const apiForm = async (data) => {
  const resp = await fetch(`${addr}/api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  let res = {};
  try {
    const text = await resp.text();
    res = text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("Failed to parse JSON:", err);
  }

  if (resp.ok && res.status === "NoActiveUserError") {
    alert('No Active user session found. Kindly login again!');
    window.location = '/action';
  }

  if (resp.ok && res.status === "done") {
    alert("API Creation Successful. Kindly head to dashboard to manage API.");
    console.log("API Created with API Name & Key ->", res.apiname, res.apikey);
  } else {
    alert("Failure Occured due to " + (res.message ? `: ${res.message}` : "."));
  }

  if (!resp.ok) {
    throw new Error("Network response was not ok");
  }

  return res;
};

export const validateActiveUser = async (data) => {
  try {
    const usertoken = "current_user";
    const resp = await fetch(`${addr}/validate_active_user`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: usertoken }),
      credentials: "include",
    });

    const res = await resp.json();

    if (resp.ok && res.status) {
      return true;
    } else {
      //alert("No active user found! Kindly login...");
      return false;
    }
  } catch (err) {
    console.error("Error checking session:", err);
    alert("Something went wrong while validating session.");
    return false;
  }
};


export const ethixionapi = async (data) => {
  try {
    const resp = await fetch(`${addr}/ethix_gatekeeper`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const rs = await resp.json();
    alert(rs.msg);
  } catch (e) {
    console.error("Error ->", e);
  }
};


export const getCurrentUser = async () => {
  const resp = await fetch(`${addr}/getcurrentuserinfo`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key: "current_user" }),
    credentials: "include",
  });

  const res = await resp.json();
  if (resp.ok) {
    return res;
  } else {
    throw new Error(res.error || "Failed to fetch user data");
  }
};

export const setEthixionRules = async (data) => {
  try {
    const resp = await fetch(`${addr} / setethixrules`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const rs = await resp.json();
    alert(rs.msg);
    if (rs.status === "NoActiveUserError") {
      //alert(rs.msg);
      window.location = "/action";
    }

  } catch (err) {
    console.error("Error -> ", err);
  }
}

export const getThreatLogs = async () => {
  const resp = await fetch(`${addr} / get_todays_threat_logs`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    credentials: 'include',
  });
  const data = await resp.json();
  if (resp.ok && data.status) {
    console.log(data);
    return data;
  } else {
    throw new Error(resp.error || "Failed to fetch logs data");
  }
};

export const getDashboardData = async () => {
  const resp = await fetch(`${addr} / dashboard_data`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    credentials: 'include',
  });
  const rs = await resp.json();
  //console.log("Backend response:", rs, "HTTP status:", resp.status);
  if (resp.ok && rs.status === "success" && rs.ReqData) {
    return rs.ReqData;
  }
  else if (rs.status === "failed") {
    return rs.msg;
  } else {
    //console.error(rs.error);
    throw new Error(resp.error || "Failed to fetch todays request count data.");
  }
}

export const getReportLogs = async () => {
  const resp = await fetch(`${addr} / reportlogs`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({}),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    console.log(rs.data1);
    console.log(rs.data2);
    return {
      data1: rs.data1,
      data2: rs.data2,
    };
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const getDashboardSecurityDetails = async () => {
  const resp = await fetch(`${addr} / security_details`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({}),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const getDashboardTrendsDetails = async () => {
  const resp = await fetch(`${addr} / trends_details`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({}),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const getDashboardTrendsStatusDetails = async () => {
  const resp = await fetch(`${addr} / trends_status`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({}),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const getDashboardAdvanceMonitorsDetails = async () => {
  const resp = await fetch(`${addr} / advance_monitors`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({}),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const getAPIData = async () => {
  const resp = await fetch(`${addr} / api_overview`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({}),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const APIDisableResp = async (data) => {
  const resp = await fetch(`${addr} / disable_API`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ apiname: data }),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status) {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const APIEnableResp = async (data) => {
  const resp = await fetch(`${addr} / enable_API`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ apiname: data }),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status) {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const APIDeleteResp = async (data) => {
  const resp = await fetch(`${addr} / delete_API`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ apiname: data }),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status) {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const APIRegenerateResp = async (data) => {
  const resp = await fetch(`${addr} / regenerate_api_key`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ apiname: data }),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const APIRegeneratedKeyResp = async (data) => {
  const resp = await fetch(`${addr} / fetch_regenerated_api_key`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ apiname: data }),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}

export const APIAlertsDataResp = async (data) => {
  const resp = await fetch(`${addr} / retrieve_api_alerts`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ apiname: data }),
  });

  const rs = await resp.json();
  if (resp.ok && rs.status === "success") {
    return rs;
  } else {
    throw new Error("Error => ", resp.error);
  }
}
