import React from 'react';
import * as fs from 'react-native-fs';
import Share from "react-native-share";
import {Platform} from 'react-native';

export class SharingProvider {
    private static m_instance: SharingProvider;

    public static getInstance(): SharingProvider {
        if (!this.m_instance) {
            this.m_instance = new SharingProvider();
        }

        return this.m_instance;
    }

    public async share() {
        try {
            await this.cleanup();
            await this.copyFiles();
            var files = await this.getFiles();
            if (files.length == 0) {
                console.log("no files to share");
                await this.cleanup();
                return;
            }

            console.log("got files, here is " + files);
            await Share.open({urls: files});
            await this.cleanup();
        } catch(err) {
            console.log("sharing error: " + err);
        }
    }

    private getDocDir() {
        var dir = fs.DocumentDirectoryPath;
        if (Platform.OS === 'android') {
            dir += "/logs";
        }
        return dir;
    }

    private getDstDir() {
        return fs.DocumentDirectoryPath + "/temp";
    }

    private async copyFiles() {
        var docDir = this.getDocDir();
        var destDir = this.getDstDir() + "/";
        await fs.mkdir(destDir);
        await fs.readDir(docDir).then( async (entries: fs.ReadDirItem[]) => {
            for (var i = 0; i < entries.length; ++i) {
                var entry = entries[i];
                if (entry.isFile() && (entry.name.startsWith("sdk") || entry.name.startsWith("voip"))) {
                    await fs.copyFile(entry.path, destDir + entry.name);
                }
            }
        })
    }

    private async cleanup() {
        var destDir = this.getDstDir();
        if (await fs.exists(destDir)) {
            await fs.unlink(destDir);
        }
    }

    private async getFiles(): Promise<string[]> {
        var files: string[] = [];
        var result = await fs.readDir(this.getDstDir()).then( (entries) => {
            for (var i = 0; i < entries.length; ++i) {
                var entry = entries[i];
                if (entry.isFile()) {
                    files.push("file://" + entry.path);
                }
            }
            files.sort();
        })
        return files;
    }

} // class