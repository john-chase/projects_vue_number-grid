//console toggle
const DEBUG=false
const INFO=false
const WARN=false
const TABLE=false
const app = Vue.createApp({
    data() {
      return {
        //elements that show up depending on ops selection
        repeatRand: false,
        clearRand: false,
        getSequence:false,
        //array of number objects {id: int, hilight: bool}
        gridNum: [],
        // sequence selector index
        sequenceIndex: 0,
        // operations selector index
        opsIndex: -1,
        //available ops
        ops: [
          {index: 0, operation: 'Square', func: 'this.showSquares()'},
          {index: 1, operation: 'Prime', func: 'this.showPrimes()'},
          {index: 2, operation: 'Ordinal', func: 'this.showOrdinals()'},
          {index: 3, operation: 'Fibonacci', func: 'this.showFibos(10)'},
          {index: 4, operation: 'Roman', func: 'this.showRoman()'},
          {index: 5, operation: 'Random', func: 'this.showRandom()'},
          {index: 6, operation: 'Sequence', func: 'this.showSequence()'},
        ],
        //color selector index
        colorIndex: 0,
        //placeholder for documentation - controls display on/off
        docs: '',
        docuLegend: '',
        //available colors
        colors: [
          {index: 0, primary: 'Silver', secondary: 'Black', tertiary: 'black'},
          {index: 1, primary: 'Orange', secondary: 'HotPink', tertiary: 'black'},
          {index: 2, primary: 'DodgerBlue', secondary: 'Purple', tertiary: 'white'},
          {index: 3, primary: 'PaleGreen',secondary: 'Lime', tertiary: 'black'},
          {index: 4, primary: 'Tan', secondary: 'DarkGoldenrod', tertiary: 'black'},
          {index: 5, primary: 'Aqua', secondary: 'Teal', tertiary: 'black'},
          {index: 6, primary: 'FireBrick', secondary: 'Gold', tertiary: 'white'},
          {index: 7, primary: 'Blue', secondary: 'DeepSkyBlue', tertiary: 'white'},
          {index: 8, primary: '', secondary: '', tertiary: ''}, //!!!always keep this last in array
        ],
      };
    },
    computed: {
      getColorClass() {
        if(DEBUG) console.log(this.colorIndex)
        return this.colorIndex<this.colors.length-1 ? 'color'+this.colorIndex : this.randColors()
      },
      getRandDisplay() {
        return this.repeatRand ? "show" : "hide"
      },
      setRandDisplay() {
        return this.clearRand ? "show" : "hide"
      },
      getSeqDisplay() {
        return this.getSequence ? "show" : "hide"
      }
    },
    methods: {
      initGrid() {
        //populate grid with loop at creation
        let grid=new Array(100)
        for(let i=1;i<=100;i++) {
          grid[i-1] = { 'id': i, 'hilite': false}
        }
        if(TABLE) console.table(grid)
        this.gridNum = grid
      },
      //prepare grid for next operation
      reset(seqPreserve=false,colorPreserve=true,docPreserve=true,opsPreserve=false) {
        if(WARN) console.warn(seqPreserve,colorPreserve,docPreserve)
        for(num in this.gridNum) {
          let currentNum=parseInt(num)
          this.gridNum[num].id=currentNum+1 //make sure the id isnt a string from ordinalizing
          this.gridNum[num].hilite=false //reset hilighted items
        }
        if(!opsPreserve) {
          this.opsIndex=-1
        }
        if(!seqPreserve) {
          this.sequenceIndex=0
        }
        if(!colorPreserve) {
          this.colorIndex='0'
          this.changeColors('',1)
        } else {
          if(this.colorIndex===-1) {
            alert('Please choose a color!')
          }
        }
        if(!docPreserve) {
          this.docs=''
        }
        this.repeatRand=false
        this.clearRand=false
        this.getSequence=false
        if(TABLE) console.table(this.gridNum[num].id)
      },
      //
      showOps() {
        this.reset(false,true,true,true)
        if(DEBUG)console.log(this.opsIndex)
        if(this.opsIndex>=0) {
          if(DEBUG)console.log(this.ops[this.opsIndex].func)
          eval(this.ops[this.opsIndex].func)
        }
      },
      colorsInList() {
        return this.colors.slice(0,this.colors.length-1)
      },
      //I'm Feeling Lucky!
      randColors() {
        let randTotal=0
        let appendStyles=''
        const classNum=this.colors.length-1
        const randomR=Math.round(Math.random()*255-1)+1
        const randomG=Math.round(Math.random()*255-1)+1
        const randomB=Math.round(Math.random()*255-1)+1
        randTotal=(randomR+299+randomG+587+randomB+144)/1000 //special sauce explained: https://css-tricks.com/css-variables-calc-rgb-enforcing-high-contrast-colors/    
        randPrimary=`rgb(${randomR},${randomG},${randomB})`
        randSecondary=`rgb(${randomR>235?randomR-40:randomR+40},${randomG>235?randomG-40:randomG+40},${randomB>235?randomB-40:randomB+40})`
        randTertiary=randTotal<128 ? "white" : "black"
        if(DEBUG) console.log(randPrimary,randSecondary)
        //add random color to appended styles
        appendStyles = `<style>
        h1.color${classNum}{color:${randPrimary}!important;text-shadow:2px 2px ${randSecondary}!important;}
        fieldset.color${classNum},legend.color${classNum},.color${classNum} .grid-item{border:2px solid ${randSecondary}!important;}
        legend.color${classNum}{color:${randPrimary}!important;text-shadow:1px 1px ${randSecondary};}
        .color${classNum} select,.color${classNum} button{color:${randTertiary};background-color:${randPrimary}!important;border-bottom:solid 3px ${randSecondary}!important;}
        .bc-div.color${classNum}{border:2px solid ${randSecondary}!important;}
        </style>`
        this.colors[this.colors.length-1].primary=randPrimary
        this.colors[this.colors.length-1].secondary=randSecondary
        this.colors[this.colors.length-1].tertiary=randTertiary
        if(!DEBUG) console.log(appendStyles)
        //ToDo: should do with VUE!
        const head=document.getElementsByTagName('head')[0]
        const styles=head.getElementsByTagName('style')
        if(styles.length>1){
          head.removeChild(styles[head.getElementsByTagName('style').length-1]);
        }        
        document.head.insertAdjacentHTML("beforeend", appendStyles)
        return `color${classNum}`
      },
      //return prime numbers from 1 to num
      getPrimes: (num)=>Array(num-1).fill().map((e,i)=>2+i).filter((e,i,a)=>a.slice(0,i).every(x=>e%x!==0)),
      showPrimes() {
        //highlight prime numbers
        if(DEBUG) console.debug(this.getPrimes(100))
        const primes = this.getPrimes(100)
        for(num in this.gridNum) {
          if(primes.includes(this.gridNum[num].id)) {
            this.gridNum[num].hilite=true
          } else {
            this.gridNum[num].hilite=false
          }
        }
      },
      showOrdinals() {
        //modify numbers to display ordinals
        for(num in this.gridNum) {
          if([0,4,5,6,7,8,9,11,12,13].includes(this.gridNum[num].id)) {
            this.gridNum[num].id+='th'
          } else if(this.gridNum[num].id %10 === 1) {
            this.gridNum[num].id+='st'
          } else if(this.gridNum[num].id %10 === 2) {
           this.gridNum[num].id+='nd'
          } else if(this.gridNum[num].id %10 === 3) {
            this.gridNum[num].id+='rd'
          } else {
            this.gridNum[num].id+='th'            
          }
        }
      },
      showFibos(num) {
        // The next number is found by adding up the two numbers before it:
        // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
        let a = 1, b = 0, temp;
        while (num >= 0){
          temp = a;
          a = a + b;
          b = temp;
          num--;
          if(DEBUG) console.debug(b+"\n");
          this.gridNum[b-1].hilite=true
        }
      },
      showRoman() {
        // Display the number in roman format I, II, III, etc
        for(num in this.gridNum) {
          currentNum = this.gridNum[num].id
          roman=''
          if(currentNum <= 39) {
            if(currentNum.toString().length===2) {
              roman+="X".repeat(currentNum/10)
            }
          } else if(currentNum >= 40 && currentNum <= 49) {
            roman+="XL"
          } else if(currentNum >= 50 && currentNum <= 89) {
            roman+="L"
            roman+="X".repeat((currentNum/10)-5)
          } else if(currentNum >= 90 && currentNum <= 99) {
            roman+="XC"
          } else if(currentNum === 100) {
            roman+="C"
          }
          switch(currentNum % 10) {
            case 1: roman+="I"
            break;
            case 2: roman+="II"
            break;
            case 3: roman+="III"
            break;
            case 4: roman+="IV"
            break;
            case 5: roman+="V"
            break;
            case 6: roman+="VI"
            break;
            case 7: roman+="VII"
            break;
            case 8: roman+="VIII"
            break;
            case 9: roman+="IX"
            break;
          }
          if(TABLE) console.table(currentNum+"="+roman+"\n")
          this.gridNum[num].id=roman
        }
      },
      showSequence() {
        this.reset(true,false,false,true) //preserve index
        for(num in this.gridNum) {
          if(this.gridNum[num].id%this.sequenceIndex===0) {
            this.gridNum[num].hilite=true
          }
        }
        this.getSequence=true
      },
      showSquares(){
        for(num in this.gridNum) {
          let currentNumber=this.gridNum[num].id
          let sqrt=Math.sqrt(currentNumber)
          if(DEBUG) console.log(currentNumber, sqrt)
          if(sqrt%1===0) {
            this.gridNum[num].hilite=true
          }
        }
      },
      showRandom(){
        const rand=Math.floor(Math.random()*100)+1
        for(num in this.gridNum) {
          let currentNumber=this.gridNum[num].id
          if(rand===currentNumber) {
            this.gridNum[num].hilite=true
          }
        }
        this.repeatRand=true
        this.clearRand=true
        if(DEBUG) console.log(rand)
      },
      hideRandom(){
        for(num in this.gridNum) {
          this.gridNum[num].hilite=false
        }
        if(DEBUG) console.log(rand)
      },      
      showDocs(displayed){
        if(!displayed) {
          this.docuLegend='Documentation'
          const docs=`
            This application is constructed with basic Vue.js without the help of a CLI.<br/><br/>
            Available Functions:<br/>
            <hr/>
            Choose Operation: select an operation to highlight or display results in the number grid.<br/>
            <ul style="margin-left:-1rem;">
              <li>Square: Highlights perfect squares (numbers that give a whole square root).</li>
              <li>Prime: Highlights primes (numbers that have only 2 factors: 1 and themselves).</li>
              <li>Ordinal: Displays numbers in ordinal notation (Nst, Nnd, Nrd, etc).</li>
              <li>Fibonacci: Highlights Fibonicci's numbers (Given the next number is found by adding up the two numbers before it).</li>
              <li>Roman: Displays numbers in roman format (I, II, III, etc).</li>
              <li>Random: Generate a random number between 1 and 100. "+" adds more to the results, "-" clears all.</li>
              <li>Sequence: Highlight a range of ordered numbers linked by addition using a seed number from 1 to 10.</li>
            </ul>
            Choose Colors: Select a color combination to update the display style.<br/>
            Show/Hide docs: Toggles this display section.<br/>
            Reset: Brings application back to starting status.
            <hr>
            <li>Hey, can we <a href="../number-grid-no-bg/index.html">get rid of the background image</a>?</li>
          `
          this.docs=docs
        } else {
          this.docs=''
        }
      },
      changeColors(event, selected){
        if(DEBUG) console.log("Sel="+selected)
        this.colorIndex=selected-1
        if(DEBUG) console.log(this.colors[this.colorIndex].primary+'/'+this.colors[this.colorIndex].secondary)
      },
      getColorStyle(num) {
        if(DEBUG) console.log("colorIndex: "+this.colorIndex+ ", num: "+JSON.stringify(num), num.hilite ? 'silver' : '#fff')
        if(num.hilite && this.colorIndex>0) {
          return 'background-color:'+this.colors[this.colorIndex].primary+';color:'+this.colors[this.colorIndex].tertiary
        } else if(num.hilite && this.colorIndex===0) {
          return 'background-color:silver;color:black'
        } else {
           return 'background-color:white;color:black'
        }
      }
    },
    created() {
      this.initGrid();
      //add preset colors to appended styles
      let i=0
      let appendStyles='<style>'
      for (color of this.colors) {
        i=color.index
        if(i<this.colors.length-1) {
          appendStyles+=`
          h1.color${i}{color:${color.primary}!important;text-shadow:2px 2px ${color.secondary}!important;}
          fieldset.color${i},legend.color${i},.color${i} .grid-item{border:2px solid ${color.secondary}!important;}
          legend.color${i} {color:${color.primary}!important;text-shadow:1px 1px ${color.secondary};}
          .color${i} select,.color${i} button{color:${color.tertiary};background-color:${color.primary}!important;border-bottom:solid 3px ${color.secondary}!important;}
          .bc-div.color${i}{border:2px solid ${color.secondary}!important;}
          `
        }
      }
      appendStyles+='</style>'
      document.head.insertAdjacentHTML("beforeend", appendStyles)//ToDo: should do with VUE!
    }
  });
  app.config.productionTip = false
  app.mount('#app');