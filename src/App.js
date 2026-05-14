import './App.css';
import Nav from './components/Nav';
import { useEffect, useRef, useState } from 'react';
import Index from './components/Index';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Action from './components/Action';
import Panel from './components/Panel';
import APIPage from './components/APIPage';
import { validateActiveUser, validateActiveWAFUser } from './api';
import EthixionRules from './components/EthixionRules';
import ThreatAlerts from './components/ThreatAlerts';
import ReportLogs from './components/ReportLogs';
import AboutEthixion from './components/AboutEthixion';
import TrafficMonitorPage from './components/TrafficMonitorPage';
import APISettings from './components/APISettings';
import VerifyAccount from './components/VerifyAccount';
import WAFPanel from './components/WAFPanel';
import WAFAPIPage from './components/WAFAPIPage';
import HTTPMethodControlPage from './components/HTTPMethodControlPage';
import DomainManagement from './components/WAFDashboard/DomainManagement';
import APIKeysManagement from './components/WAFDashboard/APIKeysManagement';
import LoggingMonitoring from './components/WAFDashboard/LoggingMonitoring';
import Alerts from './components/WAFDashboard/Alerts';
import NetworkListener from './NetworkListener';
import Documentation from './components/Documentation';

import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { Toaster, toast } from 'sonner';
import { SetService } from './components/ServiceAccifier';
import RateLimiting from './components/WAFDashboard/RateLimiting';

function RouteSecurityHandler({ children }) {
  const [isValidated, setIsValidated] = useState(null);
  const alertedRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const validate = async () => {
      try {
        const isValid = await validateActiveUser();
        setIsValidated(isValid);

        if (!isValid && !alertedRef.current) {
          toast.error('No active user found! Kindly login...');
          alertedRef.current = true;
        }
      } catch (err) {
        console.error('Validation error:', err);
        toast.error('Unable to validate session. Please log in.');
        setIsValidated(false);
      }
    };

    validate();
  }, []);

  if (isValidated === null) {
    return <div>Loading...</div>;
  }

  if (!isValidated) {
    return <Navigate to="/action" state={{ from: location }} replace />;
  }

  return children;
}

function WAFRoutesSecurityHandler({ children }) {
  const [isValidated, setIsValidated] = useState(null);
  const alertedRef = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const validate = async () => {
      try {
        const isValid = await validateActiveWAFUser();
        setIsValidated(isValid);

        if (!isValid && !alertedRef.current) {
          toast.error('No active user found! Kindly login...');
          alertedRef.current = true;
        }
      } catch (err) {
        console.error('Validation error:', err);
        toast.error('Unable to validate session. Please log in.');
        setIsValidated(false);
      }
    };

    validate();
  }, []);

  if (isValidated === null) {
    return <div>Loading...</div>;
  }

  if (!isValidated) {
    return <Navigate to="/action" state={{ from: location }} replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Nav />
        <Index />
      </>
    ),
  },
  {
    path: '/action',
    element: (
      <>
        <Nav />
        <Action />
      </>
    ),
  },
  {
    path: '/asg_dashboard',
    element: (
      <SetService service="ASG_SERVICE">
        <RouteSecurityHandler>
          <Panel />
        </RouteSecurityHandler>
      </SetService>
    ),
  },
  {
    path: '/waf_dashboard',
    element: (
      <SetService service="WAF_SERVICE">
        <WAFRoutesSecurityHandler>
          <WAFPanel />
        </WAFRoutesSecurityHandler>
      </SetService>
    ),
  },
  {
    path: '/api',
    element: (
      <RouteSecurityHandler>
        <>
          <Nav />
          <APIPage />
        </>
      </RouteSecurityHandler>
    ),
  },
  {
    path: '/waf_api',
    element: (
      <WAFRoutesSecurityHandler>
        <>
          <Nav />
          <WAFAPIPage />
        </>
      </WAFRoutesSecurityHandler>
    ),
  },
  {
    path: '/domainmanagement',
    element: (
      <WAFRoutesSecurityHandler>
        <>
          <DomainManagement />
        </>
      </WAFRoutesSecurityHandler>
    ),
  },
  {
    path: '/ratelimit',
    element: (
      <WAFRoutesSecurityHandler>
        <>
          <RateLimiting />
        </>
      </WAFRoutesSecurityHandler>
    ),
  },
  {
    path: '/apikeys',
    element: (
      <WAFRoutesSecurityHandler>
        <>
          <APIKeysManagement />
        </>
      </WAFRoutesSecurityHandler>
    ),
  },
  {
    path: '/httpcontrol',
    element: (
      <WAFRoutesSecurityHandler>
        <>
          <HTTPMethodControlPage />
        </>
      </WAFRoutesSecurityHandler>
    ),
  },
  {
    path: '/logs',
    element: (
      <WAFRoutesSecurityHandler>
        <>
          <LoggingMonitoring />
        </>
      </WAFRoutesSecurityHandler>
    ),
  },
  {
    path: '/alerts',
    element: (
      <WAFRoutesSecurityHandler>
        <>
          <Alerts />
        </>
      </WAFRoutesSecurityHandler>
    ),
  },
  {
    path: '/firewall_rules',
    element: (
      <RouteSecurityHandler>
        <EthixionRules />
      </RouteSecurityHandler>
    ),
  },
  {
    path: '/threat_alerts',
    element: (
      <RouteSecurityHandler>
        <ThreatAlerts />
      </RouteSecurityHandler>
    ),
  },
  {
    path: '/reportlogs',
    element: (
      <RouteSecurityHandler>
        <ReportLogs />
      </RouteSecurityHandler>
    ),
  },
  {
    path: '/documentation',
    element: <Documentation />,
  },
  {
    path: '/SDK',
    element: <DownloadEthixionSDK />,
  },
  {
    path: '/traffic_insights',
    element: <TrafficMonitorPage />,
  },
  {
    path: '/trends_status',
    element: <TrafficMonitorPage />,
  },
  {
    path: '/api_settings',
    element: <APISettings />,
  },
  {
    path: '/about',
    element: (
      <>
        <Nav />
        <AboutEthixion />
      </>
    ),
  },
  {
    path: '/verify_user',
    element: (
      <>
        <Nav />
        <VerifyAccount />
      </>
    ),
  },
]);

function App() {
  return (
    <div className="App">
      <NetworkListener />
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </div>
  );
}

function DownloadEthixionSDK() {
  useEffect(() => {
    const link = document.createElement('a');
    link.href = '/SDK/Ethixion-SDK.zip';
    link.download = 'Ethixion_SDK.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return <Navigate to="/" replace />;
}

export default App;
