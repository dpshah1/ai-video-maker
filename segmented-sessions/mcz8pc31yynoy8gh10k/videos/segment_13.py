from manim import *

class OptimalityScene(Scene):
    def construct(self):

        title = Text("Optimality: Who Wins, Who Loses?", font_size=36)
        title.set_color(YELLOW)

        background = Rectangle(width=title.width + 0.5, height=title.height + 0.5, color=BLUE)
        background.move_to(title.get_center())

        title.move_to(background.get_center())

        self.play(Create(background), Write(title))

        self.wait(1.5)

        self.play(FadeOut(background), FadeOut(title))

        winner_text = Text("Winner: Optimal Strategy", font_size=24).set_color(GREEN)
        loser_text = Text("Loser: Suboptimal Strategy", font_size=24).set_color(RED)

        winner_text.to_edge(UP)
        loser_text.to_edge(DOWN)

        self.play(Write(winner_text), Write(loser_text))

        self.wait(1.7)

        self.play(FadeOut(winner_text), FadeOut(loser_text))

        self.wait(0.1)