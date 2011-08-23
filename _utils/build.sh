#!bash


# 0 - PREPARATION
cd ./_utils

# 1 - PREPROCESSING
cat ../engine/_prefix.js ../engine/g.js ../engine/g.main.js  ../engine/g.game.js ../engine/_suffix.js > ../g.tmp.js
#../engine/g.game.js ../engine/g.loader.js

 #let clean what is possible before doing something
  #fixjstyle ../g.tmp.js

# 2 - COMPILING
java -jar ./compiler/compiler.jar --js ../g.tmp.js --js_output_file ../g.min.js --compilation_level SIMPLE_OPTIMIZATIONS

#--jscomp_off=internetExplorerChecks
#--language_in=ECMASCRIPT5

#rm ../g.tmp.js


