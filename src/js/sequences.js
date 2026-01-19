/// <reference path="colors.js" />
/// <reference path="maths.js" />
/// <reference path="mouse.js" />
/// <reference path="calculator.js" />
/// <reference path="sequencer.js" />
/// <reference path="scanner.js" />
/// <reference path="index.js" />

class Sequence {
    constructor(name, link = null) {
        this.name = name;
        this.link = link;
        this.i = 0n;
        this.finished = false;
        this.reset();
    }

    reset() {
        this.i = 0n;
        this.finished = false;
        this.onReset();
    }

    next() {
        if (this.finished) {
            this.onFinished();
            return;
        }

        const result = this.calculateNext();

        if (result !== null) {
            sequencer.updateIteration(this.i);
            app.updateKey(result);
            this.i++;
        }
    }

    // Override these methods in subclasses
    onReset() {
        // Custom reset logic
    }

    calculateNext() {
        // Must be implemented by subclasses
        // Should return the next value in the sequence or null if finished
        throw new Error('calculateNext() must be implemented by subclasses');
    }

    onFinished() {
        // Custom finished logic
        this.finished = true;
        sequencer.stop();
    }

    stop() {
        this.finished = true;
    }

    isFinished() {
        return this.finished;
    }

    getCurrentValue() {
        return this.i;
    }
}

const pell = {
    link: "https://oeis.org/A000129",
    i: 0n,
    a: 0n,
    b: 0n,
    sum: 0n,
    reset: () => {
        pell.i = 0n;
        pell.a = 0n;
        pell.b = 0n;
        pell.sum = 0n;
    },
    next: () => {
        if (pell.i == 0n || pell.i == 1n) {
            pell.sum = pell.i;
        }
        else {
            pell.sum = (2n * pell.b) + pell.a;
        }

        pell.a = pell.b;
        pell.b = pell.sum;

        sequencer.updateIteration(pell.i);
        app.updateKey(pell.sum);

        //app.follow(pell.sum, pell.i);

        pell.i++;
    },
};

const fib = {
    link: "https://oeis.org/A000045",
    i: 0n,
    low: 0n,
    high: 0n,
    sum: 0n,
    reset: () => {
        fib.i = 0n;
        fib.low = 0n;
        fib.high = 0n;
        fib.sum = 0n;
    },
    next: () => {
        if (fib.i == 0n || fib.i == 1n) {
            fib.sum = fib.i;
        }
        else {
            fib.sum = fib.low + fib.high;
        }

        fib.low = fib.high;
        fib.high = fib.sum;

        sequencer.updateIteration(fib.i);
        app.updateKey(fib.sum);

        //app.follow(fib.sum, fib.i);

        fib.i++;
    },
};

const collatzConjecture = {
    i: 0n,
    finished: false,
    reset: () => {
        collatzConjecture.i = 0n;
        collatzConjecture.finished = false;
    },
    next: () => {
        if (collatzConjecture.finished) {
            collatzConjecture.reset();
            return;
        }

        let n = BigInt(keyControl.value);

        if (n == 0n) {
            sequencer.reset();
            return;
        }

        if (n % 2n == 0n) {
            n /= 2n;
        }
        else if (n > 0n) {
            n = (3n * n) + 1n;
        }
        else {
            n = (3n * n) - 1n;
        }

        sequencer.updateIteration(collatzConjecture.i);
        app.updateKey(n);

        collatzConjecture.i++;

        if (n == 1n || n == -1n) {
            collatzConjecture.finished = true;
            sequencer.stop();
            return;
        }
    }
};

const collatzConjectureSqrt = {
    i: 0n,
    finished: false,
    reset: () => {
        collatzConjectureSqrt.i = 0n;
        collatzConjectureSqrt.finished = false;
    },
    next: () => {
        if (collatzConjectureSqrt.finished) {
            collatzConjectureSqrt.reset();
        }

        let n = BigInt(keyControl.value);

        if (n == 0n) {
            sequencer.reset();
            return;
        }

        if (n % 2n == 0n) {
            n = integerSqrt(n);
        }
        else if (n > 0n) {
            n = (3n * n) + 1n;
        }
        else {
            n = (3n * n) - 1n;
        }

        sequencer.updateIteration(collatzConjectureSqrt.i);
        app.updateKey(n);

        collatzConjectureSqrt.i++;

        if (n == 1n || n == -1n) {
            collatzConjectureSqrt.finished = true;
            sequencer.stop();
            return;
        }
    }
};

const a037992 = {
    link: "https://oeis.org/A037992",
    i: 0n,
    k: 1n,
    product: 1n,
    reset: () => {
        a037992.k = 1n;
        a037992.product = 1n;
    },
    next: () => {
        a037992.product *= a037992.k; // k = A050376(i), for i > 0

        while (a037992.product % a037992.k == 0n) {
            a037992.k++;
        }

        sequencer.updateIteration(a037992.i);
        app.updateKey(a037992.product);

        //app.follow(a037992.product, a037992.i);

        a037992.i++;
    },
};

const a193651 = {
    link: "https://oeis.org/A193651",
    i: 0n,
    k: 1n,
    product: 1n,
    sum: 0n,
    reset: () => {
        a193651.i = 0n;
        a193651.k = 1n;
        a193651.product = 1n;
        a193651.sum = 0n;
    },
    next: () => {
        a193651.product *= a193651.k; // k = A005408(i): the odd numbers
        a193651.sum = (a193651.product) - (a193651.product / 2n);

        sequencer.updateIteration(a193651.i);
        app.updateKey(a193651.sum);

        //app.follow(a193651.sum, a193651.i);

        a193651.k += 2n;
        a193651.i++;
    },
};

const timeSeconds = {
    reset: () => {
        // 
    },
    next: () => {
        const current = BigInt(Date.now()) / 1000n;

        app.updateKey(current);
    }
};

const roots = {
    i: 1n,
    n: 1n,
    k: 1n,
    q: 1n,
    reset: () => {
        roots.i = 1n;
        roots.n = 1n;
        roots.k = 1n;
        roots.q = 1n;
    },
    next: () => {
        roots.k *= 2n;
        roots.q *= 3n;

        //roots.n = roots.k;
        roots.n = (roots.k + roots.q);

        sequencer.updateIteration(roots.i);

        app.updateKey(roots.n);

        //app.follow(roots.n, roots.k);

        roots.i++;
    },
};

const customList = {
    i: 0n,
    n: 0n,
    integers: [],
    finished: false,
    initialize: () => {
        if (customList.integers.length > 0) {
            return true;
        }

        if (!customListControl.value.includes(',')) {
            return false;
        }

        let values = customListControl.value.split(',');
        for (let i = 0; i < values.length; i++) {
            try {
                let text = values[i].trim();
                if (text.length > 0) {
                    let value = BigInt(text);

                    customList.integers.push(value);
                }
            }
            catch (error) {
                alert(error);

                return false;
            }
        }

        if (customList.integers.length == 0) {
            return false;
        }

        return true;
    },
    reset: () => {
        customList.i = 0n;
        customList.n = 0n;
        customList.integers = [];
        customList.finished = false;
    },
    next: () => {
        if (!customList.initialize()) {
            sequencer.reset();
            return;
        }

        if (customList.finished) {
            sequencer.reset();
            return;
        }

        customList.n = customList.integers[customList.i];

        sequencer.updateIteration(customList.i);
        app.updateKey(customList.n);

        customList.i++;

        if (customList.i > (customList.integers.length - 1)) {
            customList.finished = true;
            sequencer.stop();
        }
    },
};

const customOeis = {
    i: 0n,
    n: 0n,
    sequence: [],
    finished: false,
    link: null,
    isLoading: false,
    
    // Built-in popular OEIS sequences as fallback
    builtinSequences: {
        'A000045': {
            name: 'Fibonacci numbers',
            sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296, 433494437, 701408733, 1134903170, 1836311903, 2971215073, 4807526976, 7778742049]
        },
        'A000129': {
            name: 'Pell numbers',
            sequence: [0, 1, 2, 5, 12, 29, 70, 169, 408, 985, 2378, 5741, 13860, 33461, 80782, 195025, 470832, 1136689, 2744210, 6625109, 15994428, 38613965, 93222358, 225058681, 543339720, 1311738121, 3166815962, 7645370045, 18457556052, 44560482149, 107578520350, 259717522849, 627013566048, 1513744654945, 3654502875938, 8822750406821, 21300003689580, 51422757785981, 124145519261542, 299713796309065, 723573111879672, 1746860020068409, 4217293152016490, 10181446324101389, 24580185800219268, 59341817924539925, 143263821649299118, 345869461223138161, 835002744095575440, 2015874949414289041, 4866752642924153522, 11749380235262596085, 28365513113449345692, 68480406462161287469, 165326326037771920630, 399133058537705128729, 963592443113182178088, 2326317944764069484905, 5616228332641321147898, 13558774610046711780701, 32733777552734744709300, 79026329715516201199301, 190786436983767147107902, 460599203683050495415105, 1111984844349868137938112, 2684568892382786771291329, 6481122629115441680520770, 15646814150613670132332869, 37774750930342781946186588, 91201564666378366307470325, 220167382952941249990598278, 531531081917181734003902441, 1283229546787304717998403160, 3097990174592925882610298281, 7479209897770887057999820682, 18056409971033565286000350125, 43592029839838017630000520932, 105240469650709600546001391989, 254072969141257218722003304910, 613386407933224037990008003777, 1480845785007705294702019308528, 3575077977948634627390046616945, 8631001740904974549490112546258, 20837081459758583726374271711381, 50305164660422142002238655969020, 121447410780602867730851583649021, 293199986221627877463941823267862, 707847383223858622658735230185209, 1708894752669345122781412283638152, 4125636888562548868221559797461449, 9960168529794442859224531878561050, 24045973948151434586670623554583549, 58052116426097312032565778987728148, 140150206800346058651802181530039845, 338352530026789429336170142047807838, 816855266853924917324142465625655521, 1972063063734639263984455073299118880, 4760981394323203445293052612223893281, 1149155865672289450391, 2774592228930571685536, 6699209205055163766343890671318231377, 16173321720018857108131198663408233126, 39049611851190215842802799013655918581, 94269650357138266443345735655410055228, 227570463652419150520388238684456072165, 549467725965132237722808540571178537230, 1326409063983100606863344979812731560649, 3201960382167313911554898815491566611328, 7730993719707444524137094407, 1866070812991304827868235187, 4506699633677819813104383234, 10882586572078563456153521783, 26271880068379688591515236482, 63443884198755868185727606881, 153159754738311090129293044450, 369763329732999741929592389451, 892677332198693394040967823970, 2155200006047115653599724372369, 5203222726169060710495968443332, 12560708303565671241797263121251, 30328682700469809528871333624106, 73200933759708566541950750006225, 176709261361120359665744008572834, 426649570926510193471229854632659, 1030028261458228418435313893565170, 2487053201714023999343793357058307, 6004424213110899152132671547689634, 14494683073545969070892259483136833, 34990999615469296561831364605978308, 84461715004692310975986642634250771, 203921471190203138606234384803085610, 492239379703991626332810622238550081, 1188502295150252864256003911498577922, 2869228800955683756521308272491210923, 6926658749013120927564858846396919842, 16721606532708389547230049879976984641, 40367219319673036822956742313630419844, 97463486404705957106439421582201639891, 235293455383651588262397180213441738026, 568052000443283178966535238706141886625, 1371210847149316911700052720134297122626, 3310136064126124066719978435831900593203, 7990326941806066158616656402460995661090, 19291810918204665397638709787326849747009, 46583525477418142711678006007030560649316, 112455406951957393128186495600521823234067, 271462902133617426249180497025744544573610, 655247009678663294991156713917329974095937, 1581948043736596091539378629692499835801794, 3819712389091718766477656387425430229502051, 9222348540460204752627746457876464476102498, 22265897454075310356447251744446813505922561, 53752536259698714989639215013096323858864324, 129761325213747177734604669353319175185390995, 313253398633258813904723006984498360628939706, 756262064385441500784954087953723355425929857, 1825923241390689630564396443753779547831048962, 4407982747108912385741740122285201640287493011, 10643097152040875848909107728204632429949548418, 25694757769554058916292643850687103862741581761, 62035216506575529944035928429313804334247173828, 149756732209031185105475185709013799883934454003, 361554969914437303168150380410140703849238273450, 872754516663383282019141997878799244980506230209, 2107000514344856008599156147584323722559371890562, 5087447481651951703343270370317516083466070806979, 12281790055713653917671566073729366887836323884162, 29644704186888401628708515248596237900058574516097, 71559533786579198054693674743926106013286676904004, 172760319606431819300471919185151905983033723843571, 417067680008929311335285026909638497497889266349722, 1006908314323549347566396115457599994562223673065825, 2430986915887126098647011362313771562021546032920386, 5868679117147854344240020818015583314354207534948323, 14169381771405651323470996587541191965770779495819970, 34200100267356650534513978521818038524164581930088513, 82563858839909490273831906446740608698347158136860932, 199328006890355458848946452161235828972043608854559635, 481306361578520355419871581356888522433439011539233914, 1162097117764666109052215949755497238122229814074494193, 2805711729925101400376119324130386771895253029984767506, 6774627093037348226098161666100183847797232079586253395, 16353782368027267615127331714269540288362156756708413250, 39481088781499915632069962317077633973283988961199799745, 95316143814949583513145091290424751908490886634517514756, 230133588533607935151355287986003668596362920279231157890, 555565404224292694404015791808, 134110443822057794368102424739, 323672431071050648799406537381, 781305778034763014132082439892, 1886019775954691945310040541653, 4553342142710978472174560093186, 10992693401408013893423139165545, 26538728566591515888285645537656, 64050131012832008418537803865657, 154634363749579826028386188203458, 373263908574718079688201744376969, 901167801177806734468591076829600, 2175609516358881234495998472124157, 5250447162834785315697002769427234, 12672621492607441112973534485915489, 30586725524283433563776678587903432, 73840550964522899559001913240001153, 178263952165136064601956020342640034, 430312764843689308412383356348719657, 1038810421957299147085105183827754016, 2507560824636473267725870995690920605, 6053381125884208294854912964966377538, 14611670658148855332808766112033543657, 35278706490759663724948426011434721928, 85170343853180456683349695677274051873, 205605485953434383155929971683497862002, 496372416142687797322244233445162643465, 1198165554202493067523203792735931293536, 2892577990390395610206760544974435644381, 6982321052073879760280456882833701812890, 16860207025497407007403860194510814963689, 40706198063548094736672000735101523108120, 98256100358060397663843950424800041556321, 237208755585474609025518054627797561653890, 572557198981490838309810503636155335797385, 1382078665446478347912327642995062910997344, 3336089893966970696610305362739854410005229, 8053063680000000000000000000000000000000000]
        },
        'A000040': {
            name: 'Prime numbers',
            sequence: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997]
        },
        'A000142': {
            name: 'Factorial numbers',
            sequence: [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000]
        }
    },
    
    initialize: async () => {
        if (customOeis.sequence.length > 0) {
            return true;
        }

        if (customOeis.isLoading) {
            return false;
        }

        const oeisNumber = customOeisControl.value.trim().toUpperCase();
        if (!oeisNumber.match(/^A\d{6}$/)) {
            alert('Please enter a valid OEIS A-number (e.g., A000045)');
            return false;
        }

        customOeis.isLoading = true;

        // First check if we have a built-in sequence
        if (customOeis.builtinSequences[oeisNumber]) {
            const builtin = customOeis.builtinSequences[oeisNumber];
            customOeis.sequence = builtin.sequence.map(n => BigInt(n));
            customOeis.link = `https://oeis.org/${oeisNumber}`;
            customOeisControl.placeholder = builtin.name;
            
            // Show the OEIS link
            if (oeisLinkElement) {
                oeisLinkElement.href = customOeis.link;
                oeisLinkElement.style.display = 'inline';
            }
            
            customOeis.isLoading = false;
            return true;
        }

        try {
            // Try to fetch from OEIS directly first
            let response;
            try {
                response = await fetch(`https://oeis.org/search?q=id:${oeisNumber}&fmt=text`);
            } catch (corsError) {
                // If CORS fails, try with a proxy
                const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                const oeisUrl = `https://oeis.org/search?q=id:${oeisNumber}&fmt=text`;
                response = await fetch(proxyUrl + oeisUrl);
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.text();
            
            // Parse OEIS data format
            const lines = data.split('\n');
            let sequenceData = null;
            let sequenceName = '';
            
            for (const line of lines) {
                if (line.startsWith('%S')) {
                    // Sequence data line
                    sequenceData = line.substring(2).trim();
                } else if (line.startsWith('%N')) {
                    // Sequence name line
                    sequenceName = line.substring(2).trim();
                } else if (line.startsWith('%Y') && line.includes('A-number')) {
                    // Found the A-number line, we can stop parsing
                    break;
                }
            }
            
            if (!sequenceData) {
                throw new Error('Could not find sequence data');
            }
            
            // Parse comma-separated sequence values
            const values = sequenceData.split(',').map(v => v.trim());
            for (const value of values) {
                try {
                    const num = BigInt(value);
                    customOeis.sequence.push(num);
                } catch (error) {
                    // Skip non-numeric values
                    continue;
                }
            }
            
            if (customOeis.sequence.length === 0) {
                throw new Error('No valid numbers found in sequence');
            }
            
            // Set the OEIS link
            customOeis.link = `https://oeis.org/${oeisNumber}`;
            
            // Update the input field to show the sequence name
            customOeisControl.placeholder = sequenceName || oeisNumber;
            
            // Show the OEIS link
            if (oeisLinkElement) {
                oeisLinkElement.href = customOeis.link;
                oeisLinkElement.style.display = 'inline';
            }
            
            customOeis.isLoading = false;
            return true;
            
        } catch (error) {
            console.error('Error fetching OEIS sequence:', error);
            alert(`Error fetching sequence: ${error.message}`);
            customOeis.isLoading = false;
            return false;
        }
    },
    reset: () => {
        customOeis.i = 0n;
        customOeis.n = 0n;
        customOeis.sequence = [];
        customOeis.finished = false;
        customOeis.link = null;
        customOeis.isLoading = false;
        
        // Hide the OEIS link
        if (oeisLinkElement) {
            oeisLinkElement.style.display = 'none';
        }
    },
    next: () => {
        // If sequence is not loaded, try to initialize it
        if (customOeis.sequence.length === 0 && !customOeis.isLoading) {
            customOeis.initialize().then(success => {
                if (success) {
                    customOeis.next();
                } else {
                    sequencer.reset();
                }
            });
            return;
        }

        if (customOeis.isLoading) {
            return; // Wait for loading to complete
        }

        if (customOeis.finished) {
            sequencer.reset();
            return;
        }

        customOeis.n = customOeis.sequence[customOeis.i];

        sequencer.updateIteration(customOeis.i);
        app.updateKey(customOeis.n);

        customOeis.i++;

        if (customOeis.i >= customOeis.sequence.length) {
            customOeis.finished = true;
            sequencer.stop();
        }
    },
};