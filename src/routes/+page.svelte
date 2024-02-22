<script>
    import {Button, Input} from 'flowbite-svelte';

    let name = "";
    let code = "";
    let color_name = "gray";
    let color_code = "gray";

    const handleJoin = () => {
        if (name && code) {
            // Perform join action here
            alert("Joining game with name: " + name + " and code: " + code);
        } else {
            color_name = name ? "green" : "red";
            color_code = code ? "green" : "red";
        }
    };

</script>

<main>
    <Input
            bind:value={name}
            color={color_name}
            id="large-input"
            size="lg"
            placeholder="Naam"
            on:blur={() => (color_name = name ? "green" : "red")}
    />
    <Input
            bind:value={code}
            color={color_code}
            id="large-input"
            size="lg"
            placeholder="Spelcode"
            on:blur={() => (color_code = code ? "green" : "red")}
    />
    <Button on:click={handleJoin} disabled={!name || !code}>Join spel</Button>

    <div id="divider">
        <span></span>
        <p class="text-sm dark:text-white">Of</p>
        <span></span>
    </div>
    <Button>Maak zelf een spel</Button>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 80vw;
    margin: auto;

    #divider {
      display: flex;
      align-items: center;
      margin: 1rem 0;

      span {
        flex: 1;
        height: 2px;
        background-color: #000000;
      }

      p {
        margin: 0 1rem;
      }
    }
  }
</style>