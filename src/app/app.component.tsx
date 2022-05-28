import React from 'react';
import { memoComponent } from '../util/memo-component';
import { GitInfo } from '../util/git-info.component';
import { GithubExplorer } from './explorer/github-explorer.component';

export interface AppProps {}

export const App: React.FC<AppProps> = memoComponent('AppMain', () => {
    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1, padding: 8 }}>
                <GithubExplorer />
            </div>
            <div>
                <GitInfo />
            </div>
        </div>
    );
});
