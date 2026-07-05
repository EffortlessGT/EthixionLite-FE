import { toast } from 'sonner';

const addr = process.env.REACT_APP_ROCKET_BACKEND_URL_DESKTOP;
console.log('Backend URL:', addr);
export const loginForm = async (data) => {
  try {
    const resp = await fetch(`${addr}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const rs = await resp.json();
    console.log('Login response:', rs);

    if (resp.ok && rs.status) {
      console.log('Redirect URL:', rs.redirectTO);
      if (rs.redirectTO) {
        window.location.href = rs.redirectTO;
        return rs;
      } else {
        console.warn('No redirectTO URL provided by backend');
        toast.error('Login successful but redirect URL missing.');
        return rs;
      }
    } else {
      toast.error(rs.message || 'Invalid credentials. Please try again.');
    }

    if (!resp.ok) {
      toast.error('Ethixion Connection Failed. Please try again later.');
    }

    return rs;
  } catch (err) {
    console.error('Error during login:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};
export const loginFormII = async (data) => {
  try {
    const resp = await fetch(`${addr}/google_login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const rs = await resp.json();

    if (resp.ok && rs.status) {
      if (rs.redirectTO) {
        window.location.href = rs.redirectTO || '/action';
      } else {
        toast.error('Login successful but redirect URL missing.');
      }
    } else {
      toast.error('No user found, Kindly register yourself first!');
    }
    if (!resp.ok) {
      toast.error('Ethixion Connection Failed. Please try again later.');
    }

    return rs;
  } catch (err) {
    console.error('Error during Google Login:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const registrationForm = async (data) => {
  try {
    const resp = await fetch(`${addr}/registration`, {
      method: 'POST',
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
      toast.error('Ethixion Connection Failed. Please try again later.');
    }

    return await resp.text();
  } catch (err) {
    console.error('Error during registration:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const VerifyUserAccount = async (token) => {
  try {
    const resp = await fetch(
      `${addr}/verify_account?token=${encodeURIComponent(token)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Verification failed');
    }
  } catch (err) {
    console.error('Error during account verification:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const apiForm = async (data) => {
  try {
    const resp = await fetch(`${addr}/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    let res = {};
    try {
      const text = await resp.text();
      res = text ? JSON.parse(text) : {};
    } catch (err) {
      console.error('Failed to parse JSON:', err);
    }

    if (resp.ok && res.status === 'NoActiveUserError') {
      toast.error('No Active user session found. Kindly login again!');
      window.location = '/action';
    }

    if (resp.ok && res.status === 'done') {
      toast.success(
        'API Creation Successful. Kindly head to dashboard to manage API.'
      );
      console.log(
        'API Created with API Name & Key ->',
        res.apiname,
        res.apikey
      );
    } else {
      toast.error(
        'Failure Occured due to ' + (res.message ? `: ${res.message}` : '.')
      );
    }

    if (!resp.ok) {
      toast.error('Ethixion Connection Failed. Please try again later.');
    }

    return res;
  } catch (err) {
    console.error('Error during API creation:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};
export const wafapiForm = async (data) => {
  try {
    const resp = await fetch(`${addr}/waf_api_handler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (resp.ok && resp.status === 'NoActiveUserError') {
      toast.error('No Active user session found. Kindly login again!');
      window.location.href = '/action';
    }
    let res = await resp.json();

    if (resp.ok && res.status === 'success') {
      toast.success(
        'Ethixion WAF API Creation Successful. Kindly head to dashboard to manage API.'
      );
    } else {
      toast.error(
        'Failure Occured due to ' + (res.message ? `: ${res.message}` : '.')
      );
    }

    if (!resp.ok) {
      toast.error('Ethixion Connection Failed. Please try again later.');
    }

    return resp;
  } catch (err) {
    console.error('Error during WAF API creation:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const validateActiveUser = async (data) => {
  try {
    const usertoken = 'current_user';
    const resp = await fetch(`${addr}/validate_active_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: usertoken }),
      credentials: 'include',
    });

    const res = await resp.json();

    if (resp.ok && res.status) {
      return true;
    } else {
      //alert("No active user found! Kindly login...");
      return false;
    }
  } catch (err) {
    console.error('Error checking session:', err);
    toast.error('Ethixion Connection Failed. Please try again later.');
    return false;
  }
};

export const validateActiveWAFUser = async (data) => {
  try {
    const usertoken = 'current_user';
    const resp = await fetch(`${addr}/validate_active_waf_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: usertoken }),
      credentials: 'include',
    });

    const res = await resp.json();

    if (resp.ok && res.status) {
      return true;
    } else {
      //alert("No active user found! Kindly login...");
      return false;
    }
  } catch (err) {
    console.error('Error checking session:', err);
    toast.error('Something went wrong while validating session.');
    return false;
  }
};

export const ethixionapi = async (data) => {
  try {
    const resp = await fetch(`${addr}/ethix_gatekeeper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    const rs = await resp.json();
    toast.error(rs.msg || 'Unexpected response from Ethixion Server');
  } catch (e) {
    console.error('Error ->', e);
  }
};

export const getCurrentUser = async () => {
  try {
    const resp = await fetch(`${addr}/getcurrentuserinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: 'current_user' }),
      credentials: 'include',
    });

    const res = await resp.json();
    if (resp.ok) {
      return res;
    } else {
      toast.error(res.error || 'Failed to fetch user data');
    }
  } catch (err) {
    console.error('Error fetching current user:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getCurrentWAFUser = async () => {
  try {
    const resp = await fetch(`${addr}/getcurrentwafuserinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: 'current_user' }),
      credentials: 'include',
    });

    const res = await resp.json();
    if (resp.ok) {
      return res;
    } else {
      toast.error(res.error || 'Failed to fetch user data');
    }
  } catch (err) {
    console.error('Error fetching current WAF user:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const setEthixionRules = async (data) => {
  try {
    const resp = await fetch(`${addr}/setethixrules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const rs = await resp.json();
    toast.error(rs.msg || 'Unexpected response from Ethixion Server');
    if (rs.status === 'NoActiveUserError') {
      //alert(rs.msg);
      window.location.href = '/action';
    }
  } catch (err) {
    console.error('Error -> ', err);
  }
};

export const getThreatLogs = async () => {
  try {
    const resp = await fetch(`${addr}/get_todays_threat_logs`, {
      method: 'POST',
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
      toast.error(resp.error || 'Failed to fetch logs data');
    }
  } catch (err) {
    console.error('Error fetching threat logs:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const checkASGExistsForCurrentUser = async () => {
  try {
    const resp = await fetch(`${addr}/check_asg_exists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success' && rs.exists) {
      return rs.exists;
    } else if (rs.status === 'failed' && !rs.exists) {
      return rs.msg;
    } else {
      toast.error(
        rs.msg ||
          'No ASG setup found for current user. Please set up ASG to view dashboard insights.'
      );
      return false;
    }
  } catch (err) {
    console.error('Error checking ASG existence:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getDashboardData = async () => {
  try {
    const resp = await fetch(`${addr}/dashboard_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      credentials: 'include',
    });
    const rs = await resp.json();
    //console.log("Backend response:", rs, "HTTP status:", resp.status);
    if (resp.ok && rs.status === 'success' && rs.ReqData) {
      return rs.ReqData;
    } else if (rs.status === 'failed') {
      return rs.msg;
    } else {
      //console.error(rs.error);
      toast.error(resp.error || 'Failed to fetch todays request count data.');
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getReportLogs = async () => {
  try {
    const resp = await fetch(`${addr}/reportlogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      console.log(rs.data1);
      console.log(rs.data2);
      return {
        data1: rs.data1,
        data2: rs.data2,
      };
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error fetching report logs:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getDashboardSecurityDetails = async () => {
  try {
    const resp = await fetch(`${addr}/security_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error fetching security details:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getDashboardTrendsDetails = async () => {
  try {
    const resp = await fetch(`${addr}/trends_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error fetching trends details:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getDashboardTrendsStatusDetails = async () => {
  try {
    const resp = await fetch(`${addr}/trends_status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error fetching trends status details:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getDashboardAdvanceMonitorsDetails = async () => {
  try {
    const resp = await fetch(`${addr}/advance_monitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error fetching advance monitors details:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getAPIData = async () => {
  try {
    const resp = await fetch(`${addr}/api_overview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error fetching API data:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const APIDisableResp = async (data) => {
  try {
    const resp = await fetch(`${addr}/disable_API`, {
      method: 'POST',
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
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error disabling API:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const APIEnableResp = async (data) => {
  try {
    const resp = await fetch(`${addr}/enable_API`, {
      method: 'POST',
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
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error enabling API:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const APIDeleteResp = async (data) => {
  try {
    const resp = await fetch(`${addr}/delete_API`, {
      method: 'POST',
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
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error deleting API:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const APIRegenerateResp = async (data) => {
  try {
    const resp = await fetch(`${addr}/regenerate_api_key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ apiname: data }),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error regenerating API key:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const APIRegeneratedKeyResp = async (data) => {
  try {
    const resp = await fetch(`${addr}/fetch_regenerated_api_key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ apiname: data }),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error fetching regenerated API key:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const APIAlertsDataResp = async (data) => {
  try {
    const resp = await fetch(`${addr}/retrieve_api_alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ apiname: data }),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error('Error => ', resp.error);
    }
  } catch (err) {
    console.error('Error fetching API alerts data:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const checkWAFExistsForCurrentUser = async () => {
  try {
    const resp = await fetch(`${addr}/check_wafsec_exists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success' && rs.exists) {
      return rs.exists;
    } else if (rs.status === 'failed' && !rs.exists) {
      return rs.msg;
    } else {
      toast.error(
        rs.msg ||
          'No WAF setup found for current user. Please set up WAF to view dashboard insights.'
      );
      return false;
    }
  } catch (err) {
    console.error('Error checking WAF existence:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getWAFDashboardData = async () => {
  try {
    const resp = await fetch(`${addr}/waf_dashboard_insights`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const rs = await resp.json();
    //console.log("Backend response:", rs, "HTTP status:", resp.status);
    if (resp.ok && rs.status === 'success' && rs.data && rs.waf_details) {
      return rs;
    } else if (rs.status === 'failed') {
      return rs.msg;
    } else {
      //console.error(rs.error);
      toast.error(resp.error || 'Failed to fetch todays request count data.');
    }
  } catch (err) {
    console.error('Error fetching WAF dashboard data:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getWAFSecurityTipOfDay = async () => {
  try {
    const resp = await fetch(`${addr}/waf_security_tip_for_day`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const rs = await resp.json();

    if (resp.ok && rs.status === 'success' && rs.tipsData) {
      return rs.tipsData;
    } else {
      toast.error(rs.msg || 'Failed to fetch security tip of the day.');
    }
  } catch (err) {
    console.error('Error fetching security tip of the day:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getDomainsData = async () => {
  try {
    const resp = await fetch(`${addr}/waf_domain_data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Failed to fetch domains data.');
    }
  } catch (err) {
    console.error('Error fetching domains data:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const updateWAFAPIDomainStatus = async (data) => {
  try {
    const resp = await fetch(`${addr}/update_waf_api_status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Failed to update WAF API domain status.');
    }
  } catch (err) {
    console.error('Error updating WAF API domain status:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const createWAFAPIDomain = async (data) => {
  try {
    const resp = await fetch(`${addr}/create_waf_api_domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Failed to create WAF API domain.');
    }
  } catch (err) {
    console.error('Error creating WAF API domain:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getHTTPMethodRules = async (apiname) => {
  try {
    const resp = await fetch(`${addr}/get_http_method_rules/${apiname}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs.data;
    } else {
      toast.error(rs.msg || 'Failed to fetch HTTP method rules.');
    }
  } catch (err) {
    console.error('Error fetching HTTP method rules:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const saveHTTPMethodRules = async (apiname, methods) => {
  try {
    const resp = await fetch(`${addr}/set_http_method_rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ apiname, methods }),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Failed to update HTTP method rules.');
    }
  } catch (err) {
    console.error('Error updating HTTP method rules:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const deleteHTTPMethodRule = async (apiname, method) => {
  try {
    const resp = await fetch(
      `${addr}/delete_http_method_rule/${apiname}/${method}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Failed to delete HTTP method rule.');
    }
  } catch (err) {
    console.error('Error deleting HTTP method rule:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const addWAFHTTPRule = async (data) => {
  try {
    const resp = await fetch(`${addr}/add_waf_http_rule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Failed to add HTTP method rule.');
    }
  } catch (err) {
    console.error('Error adding HTTP method rule:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getWAFAPIRateLimitingRules = async (apiname) => {
  try {
    const resp = await fetch(`${addr}/get_rate_limiting_rules`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs.rate_limit_data || rs.data;
    } else {
      toast.error(rs.msg || 'Failed to fetch rate limiting rules.');
    }
  } catch (err) {
    console.error('Error fetching rate limiting rules:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const setRateLimitingRules = async (data) => {
  try {
    const resp = await fetch(`${addr}/set_rate_limiting_rules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        waf_name: data.rate_limit_data[0].waf_name,
        rate_limit: data.rate_limit_data[0].rate_limit,
        sec: data.rate_limit_data[0].sec,
        waf_api_status: data.rate_limit_data[0].waf_api_status,
      }),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    }
  } catch (err) {
    console.error('Error setting rate limiting rules:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const getAllTimeWAFTrends = async (apiname) => {
  try {
    const resp = await fetch(`${addr}/retrieve_waf_api_logs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Failed to fetch WAF trends data.');
    }
  } catch (err) {
    console.error('Error fetching WAF trends data:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const loggingMontoringDashData = async () => {
  try {
    const data = await fetch(`${addr}/waf_dashboard_insights`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const rs = await data.json();
    if (rs.status === 'success' && rs.data) {
      return rs.data;
    }
  } catch (err) {
    console.error('Error fetching logging and monitoring dashboard data:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};

export const fetchAPIKeysData = async () => {
  try {
    const resp = await fetch(`${addr}/get_waf_api_key_management_data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs.data;
    } else {
      toast.error(rs.msg || 'Failed to fetch API keys.');
      return [];
    }
  } catch (err) {
    console.error('Error fetching API keys:', err);
    toast.error('Unable to reach server. Please try again later.');
    return [];
  }
};

export const retrieveWAFAPIKeyByAuthentication = async (data) => {
  try {
    const resp = await fetch(`${addr}/get_waf_api_key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const rs = await resp.json();
    if (resp.ok && rs.status === 'success') {
      return rs;
    } else {
      toast.error(rs.msg || 'Failed to retrieve WAF API key.');
    }
  } catch (err) {
    console.error('Error retrieving WAF API key:', err);
    toast.error('Unable to reach server. Please try again later.');
  }
};
