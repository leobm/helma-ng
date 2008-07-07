/*
 *  Copyright 2008 Hannes Wallnoefer <hannes@helma.at>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.helma.tools;

import org.helma.javascript.RhinoEngine;
import org.helma.util.StringUtils;

public class HelmaRunner {

    public static void main(String[] args) throws Exception {
        String modulePath = null;
        if (args.length > 0) {
            if ("--help".equals(args[0]) || "-h".equals(args[0])) {
                printUsage();
                return;
            }
            modulePath = StringUtils.join(args, ",");
        }
        HelmaConfiguration config = new HelmaConfiguration(null, modulePath);
        RhinoEngine engine = new RhinoEngine(config);
        engine.invoke(config.getMainModule("main"), "main", null);
    }

    public static void printUsage() {
        System.out.println("Usage:");
        System.out.println("    java -jar server.jar [MAINFILE|SCRIPTDIR] [SCRIPTDIR] ...");
    }
}
