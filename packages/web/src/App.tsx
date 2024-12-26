import { useEffect, useState } from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import {
  Button,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';
import '@cloudscape-design/global-styles/index.css';

import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { signOut } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';

import { TranscribeStreamingClient } from '@aws-sdk/client-transcribe-streaming';

import './App.css';
import awsExports from './aws-exports';
import LiveTranscriptions from './components/LiveTranscriptions';
import { Transcript } from './types';
import { fetchAuthSession } from '@aws-amplify/core';
import { AWSCredentials } from '@aws-amplify/core/internals/utils';

Amplify.configure(awsExports);

function App() {
  const [currentCredentials, setCurrentCredentials] = useState<AWSCredentials>({
    accessKeyId: '',
    secretAccessKey: '',
  });
  // const [currentSession, setCurrentSession] = useState<CognitoUserSession>();

  const [transcriptionClient, setTranscriptionClient] = useState<TranscribeStreamingClient | null>(
    null
  );
  const [transcribeStatus, setTranscribeStatus] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<Transcript>();
  const [lines, setLines] = useState<Transcript[]>([]);
  const [currentLine, setCurrentLine] = useState<Transcript[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<AudioWorkletNode>();

  useEffect(() => {
    async function getAuth() {
      const authSession = await fetchAuthSession();
      const currCreds = authSession.credentials!;
      return currCreds;
    }

    getAuth().then((res) => {
      const currCreds = res;
      setCurrentCredentials(currCreds);
    });
  }, []);

  useEffect(() => {
    if (transcript) {
      setTranscript(transcript);
      if (transcript.partial) {
        setCurrentLine([transcript]);
      } else {
        setLines([...lines, transcript]);
        setCurrentLine([]);
      }
    }
  }, [transcript]);

  const handleTranscribe = async () => {
    setTranscribeStatus(!transcribeStatus);
    if (transcribeStatus) {
      console.log('Stopping transcription');
    } else {
      console.log('Starting transcription');
    }
    return transcribeStatus;
  };

  return (
    <Router>
      <Authenticator>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ContentLayout
                  header={
                    <SpaceBetween size="m">
                      <Header
                        variant="h1"
                        description="Demo of live transcriptions"
                        actions={
                          <SpaceBetween direction="horizontal" size="m">
                            <Button variant="primary" onClick={handleTranscribe}>
                              {transcribeStatus ? 'Stop Transcription' : 'Start Transcription'}
                            </Button>

                            <Button variant="primary" onClick={() => signOut()}>
                              Sign out
                            </Button>
                          </SpaceBetween>
                        }
                      >
                        Amazon Transcribe Live Transcriptions
                      </Header>
                    </SpaceBetween>
                  }
                >
                  <Container header={<Header variant="h2">Transcriptions</Header>}>
                    <SpaceBetween size="xs">
                      <div style={{ height: '663px' }} className={'transcriptionContainer'}>
                        {lines.map((line, index) => {
                          return (
                            <div key={index}>
                              <strong>Channel {line.channel}</strong>: {line.text}
                              <br />
                            </div>
                          );
                        })}
                        {currentLine.length > 0 &&
                          currentLine.map((line, index) => {
                            return (
                              <div key={index}>
                                <strong>Channel {line.channel}</strong>: {line.text}
                                <br />
                              </div>
                            );
                          })}
                      </div>
                    </SpaceBetween>
                  </Container>
                </ContentLayout>
                <LiveTranscriptions
                  currentCredentials={currentCredentials}
                  mediaRecorder={mediaRecorder}
                  setMediaRecorder={setMediaRecorder}
                  setTranscriptionClient={setTranscriptionClient}
                  transcriptionClient={transcriptionClient}
                  transcribeStatus={transcribeStatus}
                  setTranscript={setTranscript}
                />
              </>
            }
          />
        </Routes>
      </Authenticator>
    </Router>
  );
}

export default App;
